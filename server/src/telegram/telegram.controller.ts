import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { TelegramBotService } from './telegram-bot.service';
import type { TelegramUpdate } from './types/telegram-update.type';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly bot: TelegramBotService) {}

  @Public()
  @Post('webhook')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: false, forbidNonWhitelisted: false, transform: false }))
  async webhook(@Body() update: TelegramUpdate) {
    await this.bot.handleUpdate(update);
    return { ok: true };
  }
}
