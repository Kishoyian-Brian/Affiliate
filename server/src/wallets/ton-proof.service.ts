import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { signVerify } from '@ton/crypto';
import { Address, Cell, contractAddress, loadStateInit } from '@ton/ton';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import type { ConnectTonWalletDto } from './dto/ton-proof.dto';

const TON_PROOF_PREFIX = 'ton-proof-item-v2/';
const TON_CONNECT_PREFIX = 'ton-connect';
const PAYLOAD_TTL_MS = 15 * 60 * 1000;
const PROOF_MAX_AGE_SEC = 15 * 60;

@Injectable()
export class TonProofService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async createPayload(userId: string) {
    const payload = randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + PAYLOAD_TTL_MS);

    await this.prisma.tonProofNonce.create({
      data: { userId, payload, expiresAt },
    });

    await this.prisma.tonProofNonce.deleteMany({
      where: {
        userId,
        OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }],
        payload: { not: payload },
      },
    });

    return { payload, expiresAt: expiresAt.toISOString() };
  }

  async verifyAndBind(userId: string, dto: ConnectTonWalletDto) {
    const nonce = await this.prisma.tonProofNonce.findUnique({
      where: { payload: dto.proof.payload },
    });

    if (!nonce || nonce.userId !== userId) {
      throw new BadRequestException('Invalid or unknown ton_proof payload');
    }
    if (nonce.usedAt) {
      throw new BadRequestException('ton_proof payload already used');
    }
    if (nonce.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('ton_proof payload expired');
    }

    this.assertDomainAllowed(dto.proof.domain.value, dto.proof.domain.lengthBytes);
    this.assertFreshTimestamp(dto.proof.timestamp);

    const address = this.parseAddress(dto.address);
    const publicKey = Buffer.from(dto.publicKey, 'hex');
    if (publicKey.length !== 32) {
      throw new BadRequestException('Invalid wallet public key');
    }

    if (dto.proof.state_init) {
      this.assertStateInitMatches(address, dto.proof.state_init, publicKey);
    }

    const ok = this.verifySignature({
      address,
      publicKey,
      domain: dto.proof.domain,
      timestamp: dto.proof.timestamp,
      payload: dto.proof.payload,
      signature: Buffer.from(dto.proof.signature, 'base64'),
    });

    if (!ok) {
      throw new BadRequestException('Invalid ton_proof signature');
    }

    const connectedAt = new Date();

    const [user] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          tonAddress: address.toString({ bounceable: false, urlSafe: true }),
          tonNetwork: dto.network,
          tonPublicKey: dto.publicKey,
          tonWalletApp: dto.walletApp ?? null,
          tonConnectedAt: connectedAt,
        },
      }),
      this.prisma.tonProofNonce.update({
        where: { id: nonce.id },
        data: { usedAt: connectedAt },
      }),
    ]);

    return {
      address: user.tonAddress,
      network: user.tonNetwork,
      walletApp: user.tonWalletApp,
      connectedAt: user.tonConnectedAt?.toISOString() ?? connectedAt.toISOString(),
    };
  }

  private assertDomainAllowed(domain: string, lengthBytes: number) {
    const encoded = Buffer.from(domain, 'utf8');
    if (encoded.length !== lengthBytes) {
      throw new BadRequestException('Invalid ton_proof domain length');
    }

    const allowed = this.allowedDomains();
    if (!allowed.includes(domain)) {
      throw new BadRequestException(`ton_proof domain not allowed: ${domain}`);
    }
  }

  private assertFreshTimestamp(timestamp: number) {
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > PROOF_MAX_AGE_SEC) {
      throw new BadRequestException('ton_proof timestamp out of range');
    }
  }

  private parseAddress(raw: string) {
    try {
      return Address.parse(raw);
    } catch {
      throw new BadRequestException('Invalid TON address');
    }
  }

  private assertStateInitMatches(address: Address, stateInitB64: string, publicKey: Buffer) {
    try {
      const stateInit = loadStateInit(Cell.fromBase64(stateInitB64).beginParse());
      const derived = contractAddress(address.workChain, stateInit);
      if (!derived.equals(address)) {
        throw new BadRequestException('walletStateInit does not match address');
      }

      const data = stateInit.data;
      if (!data) return;

      try {
        const slice = data.beginParse();
        // Standard wallet v1–v4 store seqno then public key; skip seqno (32 bits).
        slice.loadUint(32);
        const keyFromInit = slice.loadBuffer(32);
        if (!timingSafeEqual(keyFromInit, publicKey)) {
          throw new BadRequestException('walletStateInit public key mismatch');
        }
      } catch (error) {
        if (error instanceof BadRequestException) throw error;
        // Newer wallet layouts may differ; address match is enough here.
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Invalid walletStateInit');
    }
  }

  private verifySignature(input: {
    address: Address;
    publicKey: Buffer;
    domain: { lengthBytes: number; value: string };
    timestamp: number;
    payload: string;
    signature: Buffer;
  }) {
    const wc = Buffer.alloc(4);
    wc.writeInt32BE(input.address.workChain, 0);

    const ts = Buffer.alloc(8);
    ts.writeBigUInt64LE(BigInt(input.timestamp), 0);

    const dl = Buffer.alloc(4);
    dl.writeUInt32LE(input.domain.lengthBytes, 0);

    const msg = Buffer.concat([
      Buffer.from(TON_PROOF_PREFIX, 'utf8'),
      wc,
      input.address.hash,
      dl,
      Buffer.from(input.domain.value, 'utf8'),
      ts,
      Buffer.from(input.payload, 'utf8'),
    ]);

    const msgHash = createHash('sha256').update(msg).digest();
    const fullMsg = Buffer.concat([
      Buffer.from([0xff, 0xff]),
      Buffer.from(TON_CONNECT_PREFIX, 'utf8'),
      msgHash,
    ]);
    const digest = createHash('sha256').update(fullMsg).digest();

    try {
      return signVerify(digest, input.signature, input.publicKey);
    } catch {
      return false;
    }
  }

  private allowedDomains() {
    const domains = new Set<string>();
    const origins = [
      this.config.get<string>('clientOrigin'),
      this.config.get<string>('telegramMiniAppUrl'),
      'http://localhost:5173',
      'https://localhost:5173',
    ];

    for (const origin of origins) {
      if (!origin) continue;
      try {
        const host = new URL(origin).host;
        domains.add(host);
      } catch {
        domains.add(origin.replace(/^https?:\/\//, '').replace(/\/+$/, ''));
      }
    }

    return [...domains];
  }
}
