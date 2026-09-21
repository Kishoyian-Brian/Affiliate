import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { AuthUser } from '../common/types/auth-user.type';
import { JoinTaskDto } from './dto/join-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { VerifyTaskDto } from './dto/verify-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Public()
  @Get()
  findAll(@Query() filter: TaskFilterDto) {
    return this.tasks.findAll(filter);
  }

  @Get('me/completions')
  myCompletions(@CurrentUser() user: AuthUser) {
    return this.tasks.myCompletions(user.id);
  }

  @Get('me/completions/:campaignId')
  completionForCampaign(
    @CurrentUser() user: AuthUser,
    @Param('campaignId') campaignId: string,
  ) {
    return this.tasks.completionForCampaign(user.id, campaignId);
  }

  @Post('join')
  join(@CurrentUser() user: AuthUser, @Body() dto: JoinTaskDto) {
    return this.tasks.join(user.id, dto);
  }

  @Post('verify')
  verify(@CurrentUser() user: AuthUser, @Body() dto: VerifyTaskDto) {
    return this.tasks.verify(user.id, dto);
  }
}
