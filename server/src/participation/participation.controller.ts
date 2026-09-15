import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user.type';
import { JoinTaskDto } from './dto/join-task.dto';
import { LeaveTaskDto } from './dto/leave-task.dto';
import { ParticipationService } from './participation.service';

@Controller('participation')
export class ParticipationController {
  constructor(private readonly participation: ParticipationService) {}

  @Post('join')
  join(@CurrentUser() user: AuthUser, @Body() dto: JoinTaskDto) {
    return this.participation.join(user.id, dto);
  }

  @Post('leave')
  leave(@CurrentUser() user: AuthUser, @Body() dto: LeaveTaskDto) {
    return this.participation.leave(user.id, dto);
  }
}
