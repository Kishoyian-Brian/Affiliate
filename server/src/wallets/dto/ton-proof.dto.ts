import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class TonProofDomainDto {
  @IsNumber()
  lengthBytes!: number;

  @IsString()
  value!: string;
}

class TonProofDto {
  @IsNumber()
  timestamp!: number;

  @ValidateNested()
  @Type(() => TonProofDomainDto)
  domain!: TonProofDomainDto;

  @IsString()
  signature!: string;

  @IsString()
  payload!: string;

  @IsOptional()
  @IsString()
  state_init?: string;
}

export class ConnectTonWalletDto {
  @IsString()
  address!: string;

  @IsString()
  network!: string;

  @IsString()
  publicKey!: string;

  @ValidateNested()
  @Type(() => TonProofDto)
  @IsObject()
  proof!: TonProofDto;

  @IsOptional()
  @IsString()
  walletApp?: string;
}
