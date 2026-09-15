import { IsString } from 'class-validator';

export class JoinTaskDto {
  @IsString()
  campaignId!: string;
}
