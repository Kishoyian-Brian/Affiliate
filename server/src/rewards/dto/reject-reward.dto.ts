import { IsString } from 'class-validator';

export class RejectRewardDto {
  @IsString()
  completionId!: string;
}
