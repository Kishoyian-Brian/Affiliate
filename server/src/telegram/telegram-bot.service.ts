import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramClient } from './telegram.client';
import { TASKLANE_START_MESSAGE, startMessageKeyboard, resolveStartButtonUrls } from './telegram-welcome';
import type { TelegramUpdate } from './types/telegram-update.type';

@Injectable()
export class TelegramBotService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramBotService.name);
  private polling = false;
  private offset = 0;
  private abort?: AbortController;

  constructor(
    private readonly client: TelegramClient,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    if (!this.client.isConfigured()) {
      this.logger.warn('TELEGRAM_BOT_TOKEN is not set; /start replies are disabled');
      return;
    }

    void this.bootBot();
  }

  onModuleDestroy() {
    this.polling = false;
    this.abort?.abort();
  }

  async handleUpdate(update: TelegramUpdate) {
    const text = update.message?.text?.trim() ?? '';
    const chat = update.message?.chat;
    if (!chat || chat.type !== 'private') return;
    if (!text.startsWith('/start')) return;

    await this.sendStartMessage(chat.id);
  }

  private async bootBot() {
    try {
      const me = await this.client.call<{ username?: string; first_name?: string }>('getMe');
      this.logger.log(`Telegram bot connected as @${me.username ?? 'unknown'}`);

      await this.client.call('setMyCommands', {
        commands: [{ command: 'start', description: 'Open Tasklane and see how to earn' }],
      });

      const webhookUrl = this.config.get<string>('telegramWebhookUrl') ?? '';
      if (webhookUrl) {
        await this.client.call('setWebhook', { url: webhookUrl });
        this.logger.log('Telegram webhook registered');
        return;
      }

      await this.client.call('deleteWebhook', { drop_pending_updates: false });
    } catch (error) {
      this.logger.warn(
        error instanceof Error ? error.message : 'Telegram bot setup failed; starting polling anyway',
      );
    }

    this.startPolling();
  }

  private async sendStartMessage(chatId: number) {
    try {
      await this.client.call('sendMessage', {
        chat_id: chatId,
        text: TASKLANE_START_MESSAGE,
        reply_markup: this.openAppKeyboard(),
      });
    } catch (error) {
      this.logger.error(error instanceof Error ? error.message : 'Failed to send /start welcome');
    }
  }

  private openAppKeyboard() {
    const { tasklaneUrl, channelUrl } = resolveStartButtonUrls({
      miniAppUrl: this.config.get<string>('telegramMiniAppUrl'),
      channelUrl: this.config.get<string>('telegramChannelUrl'),
      channelUsername: this.config.get<string>('telegramChannelUsername'),
      botUsername: this.config.get<string>('telegramBotUsername'),
    });

    return startMessageKeyboard(tasklaneUrl, channelUrl);
  }

  private startPolling() {
    this.polling = true;
    this.abort = new AbortController();
    this.logger.log('Telegram /start polling started');
    void this.poll();
  }

  private async poll() {
    while (this.polling) {
      try {
        const updates = await this.client.call<TelegramUpdate[]>(
          'getUpdates',
          {
            offset: this.offset,
            timeout: 8,
            allowed_updates: ['message'],
          },
          this.abort?.signal,
        );

        for (const update of updates) {
          this.offset = update.update_id + 1;
          await this.handleUpdate(update);
        }
      } catch (error) {
        if (!this.polling || this.abort?.signal.aborted) return;
        const message = error instanceof Error ? error.message : 'Telegram polling failed';
        this.logger.warn(message);
        const waitMs = /Unauthorized/i.test(message) ? 15000 : 5000;
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }
}
