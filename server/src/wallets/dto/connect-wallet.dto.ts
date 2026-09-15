import { IsIn, IsString } from 'class-validator';

export class ConnectWalletDto {
  @IsString()
  @IsIn(['ton', 'usdt', 'telegram_stars'])
  method!: 'ton' | 'usdt' | 'telegram_stars';

  @IsString()
  destination!: string;
}
