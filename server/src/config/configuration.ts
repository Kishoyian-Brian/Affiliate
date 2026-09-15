export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
  telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME ?? 'tasklane_bot',
  telegramWebhookUrl: process.env.TELEGRAM_WEBHOOK_URL ?? '',
  telegramMiniAppUrl: process.env.TELEGRAM_MINI_APP_URL ?? 'https://client-psi-six-83.vercel.app',
  telegramChannelUrl: process.env.TELEGRAM_CHANNEL_URL ?? '',
  telegramChannelUsername: process.env.TELEGRAM_CHANNEL_USERNAME ?? 'TasklaneSupport',
  jwt: {
    secret: process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
