import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Public()
  @Get()
  info() {
    return this.app.getInfo();
  }
}
