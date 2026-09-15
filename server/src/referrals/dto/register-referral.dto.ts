import { IsString } from 'class-validator';

export class RegisterReferralDto {
  @IsString()
  campaignId!: string;

  @IsString()
  referrerId!: string;
}
