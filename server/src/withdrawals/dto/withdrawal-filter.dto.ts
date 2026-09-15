import { IsOptional, IsString } from 'class-validator';

export class WithdrawalFilterDto {
  @IsOptional()
  @IsString()
  status?: string;
}
