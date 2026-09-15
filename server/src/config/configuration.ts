export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
  jwt: {
    secret: process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
