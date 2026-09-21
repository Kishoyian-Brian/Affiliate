import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  title!: string;

  @IsString()
  shortDescription!: string;

  @IsString()
  description!: string;

  @IsString()
  type!: 'subscribe' | 'referral' | 'affiliate';

  @IsString()
  channelUsername!: string;

  @IsString()
  channelTitle!: string;

  @IsString()
  sponsorName!: string;

  @IsString()
  rewardAmount!: string;

  @IsOptional()
  @IsInt()
  holdHours?: number;

  @IsInt()
  @Min(1)
  slotsTotal!: number;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}
