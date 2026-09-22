import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class CampaignRequirementsDto {
  @IsBoolean()
  mustStaySubscribed!: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  holdHours!: number;

  @IsBoolean()
  newMembersOnly!: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minAccountAgeDays?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxCompletionsPerUser!: number;
}
