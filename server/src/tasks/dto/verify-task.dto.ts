import { IsString } from 'class-validator';

export class VerifyTaskDto {
  @IsString()
  campaignId!: string;
}
