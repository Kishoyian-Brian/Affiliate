import { IsOptional, IsString } from 'class-validator';

export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  destination?: string;
}
