import { IsString } from 'class-validator';

export class VerifyMembershipDto {
  @IsString()
  channelUsername!: string;

  @IsString()
  telegramUserId!: string;
}
