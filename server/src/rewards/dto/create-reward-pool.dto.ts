import { IsString } from 'class-validator';

export class CreateRewardPoolDto {
  @IsString()
  campaignId!: string;

  @IsString()
  amount!: string;
}
