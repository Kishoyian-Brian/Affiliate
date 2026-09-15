import { IsIn, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsString()
  @IsIn(['active', 'restricted'])
  status!: 'active' | 'restricted';
}
