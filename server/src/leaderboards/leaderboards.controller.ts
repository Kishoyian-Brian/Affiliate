import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { LeaderboardsService } from './leaderboards.service';

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboards: LeaderboardsService) {}

  @Public()
  @Get()
  findAll() {
    return this.leaderboards.findAll();
  }
}
