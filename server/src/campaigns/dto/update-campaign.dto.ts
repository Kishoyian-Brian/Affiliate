import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

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
  sponsorName?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  slotsTotal?: number;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;
}
