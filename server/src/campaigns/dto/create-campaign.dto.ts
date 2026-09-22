import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CampaignRequirementsDto } from './campaign-requirements.dto';

export class CreateCampaignDto {
  @IsString()
  title!: string;

  @IsString()
  shortDescription!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsIn(['subscribe', 'referral', 'affiliate'])
  type!: 'subscribe' | 'referral' | 'affiliate';

  @IsString()
  channelUsername!: string;

  @IsString()
  channelTitle!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  channelMemberCount!: number;

  @IsString()
  sponsorName!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rewardAmount!: number;

  @IsString()
  rewardCurrency!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  referralTarget?: number;

  @IsOptional()
  @IsString()
  affiliateUrl?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  holdHours!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  slotsTotal!: number;

  @ValidateNested()
  @Type(() => CampaignRequirementsDto)
  requirements!: CampaignRequirementsDto;

  @IsArray()
  @IsString({ each: true })
  rules!: string[];

  @IsString()
  @IsIn(['draft', 'active', 'paused', 'ended'])
  status!: 'draft' | 'active' | 'paused' | 'ended';

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}
