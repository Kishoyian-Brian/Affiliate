import { setDefaultResultOrder } from 'node:dns';
import { request as httpsRequest } from 'node:https';
import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

setDefaultResultOrder('ipv4first');

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

@Injectable()
export class TelegramClient {
  constructor(private readonly config: ConfigService) {}

  isConfigured() {
    return Boolean(this.token);
  }

  async call<T>(
    method: string,
    body: Record<string, unknown> = {},
    signal?: AbortSignal,
  ): Promise<T> {
    if (!this.token) {
      throw new ServiceUnavailableException('TELEGRAM_BOT_TOKEN is not configured');
    }

    const timeoutMs = method === 'getUpdates' ? 20_000 : 15_000;
    const payload = await telegramPost(
      `https://api.telegram.org/bot${this.token}/${method}`,
      JSON.stringify(body),
      timeoutMs,
      signal,
    );

    if (!payload.ok || payload.result === undefined) {
      throw new BadGatewayException(payload.description ?? `Telegram ${method} failed`);
    }
    return payload.result as T;
  }

  private get token() {
    const value =
      this.config.get<string>('telegramBotToken') ?? this.config.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
    return value.trim();
  }
}

function telegramPost(
  url: string,
  body: string,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<TelegramApiResponse<unknown>> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = httpsRequest(
      {
        protocol: 'https:',
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'POST',
        family: 4,
        timeout: timeoutMs,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk as Buffer));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')) as TelegramApiResponse<unknown>);
          } catch {
            reject(new Error(`Telegram returned invalid JSON (HTTP ${res.statusCode ?? 0})`));
          }
        });
      },
    );

    const fail = (error: Error) => {
      req.destroy();
      reject(error);
    };

    req.on('error', (error) => fail(error instanceof Error ? error : new Error(String(error))));
    req.on('timeout', () => fail(new Error(`Telegram request timed out after ${timeoutMs}ms`)));

    if (signal) {
      if (signal.aborted) {
        fail(new Error('Telegram request aborted'));
        return;
      }
      signal.addEventListener('abort', () => fail(new Error('Telegram request aborted')), { once: true });
    }

    req.write(body);
    req.end();
  });
}
