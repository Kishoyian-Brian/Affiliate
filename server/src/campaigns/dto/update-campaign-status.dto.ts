import { IsIn, IsString } from 'class-validator';

export class UpdateCampaignStatusDto {
  @IsString()
  @IsIn(['draft', 'active', 'paused', 'ended'])
  status!: 'draft' | 'active' | 'paused' | 'ended';
}
