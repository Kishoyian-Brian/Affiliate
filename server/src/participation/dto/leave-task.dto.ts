import { IsString } from 'class-validator';

export class LeaveTaskDto {
  @IsString()
  campaignId!: string;
}
