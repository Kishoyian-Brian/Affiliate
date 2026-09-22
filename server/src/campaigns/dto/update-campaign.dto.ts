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

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['subscribe', 'referral', 'affiliate'])
  type?: 'subscribe' | 'referral' | 'affiliate';

  @IsOptional()
  @IsString()
  channelUsername?: string;

  @IsOptional()
  @IsString()
  channelTitle?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  channelMemberCount?: number;

  @IsOptional()
  @IsString()
  sponsorName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rewardAmount?: number;

  @IsOptional()
  @IsString()
  rewardCurrency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  referralTarget?: number;

  @IsOptional()
  @IsString()
  affiliateUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  holdHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  slotsTotal?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CampaignRequirementsDto)
  requirements?: CampaignRequirementsDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rules?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['draft', 'active', 'paused', 'ended'])
  status?: 'draft' | 'active' | 'paused' | 'ended';

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;
}
