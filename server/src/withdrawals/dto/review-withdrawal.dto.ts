import { IsIn, IsString } from 'class-validator';

export class ReviewWithdrawalDto {
  @IsString()
  @IsIn(['processing', 'completed', 'rejected'])
  status!: 'processing' | 'completed' | 'rejected';
}
