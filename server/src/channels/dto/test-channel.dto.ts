import { IsString } from 'class-validator';

export class TestChannelDto {
  @IsString()
  username!: string;
}
