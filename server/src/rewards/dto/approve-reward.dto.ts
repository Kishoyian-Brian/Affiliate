import { IsString } from 'class-validator';

export class ApproveRewardDto {
  @IsString()
  completionId!: string;
}
