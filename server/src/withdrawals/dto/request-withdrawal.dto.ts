import { IsIn, IsNumber, IsString, Min } from 'class-validator';

export class RequestWithdrawalDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsIn(['ton', 'usdt', 'telegram_stars'])
  method!: 'ton' | 'usdt' | 'telegram_stars';

  @IsString()
  destination!: string;
}
