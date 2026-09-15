import { IsIn, IsOptional, IsString } from 'class-validator';

export class CampaignFilterDto {
  @IsOptional()
  @IsString()
  @IsIn(['draft', 'active', 'paused', 'ended'])
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
