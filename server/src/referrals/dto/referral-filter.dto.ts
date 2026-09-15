import { IsOptional, IsString } from 'class-validator';

export class ReferralFilterDto {
  @IsOptional()
  @IsString()
  campaignId?: string;
}
