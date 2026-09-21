import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createValidationPipe } from './common/pipes/validation.pipe';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function toJSON() {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  const allowedOrigins = new Set(
    [
      config.get<string>('clientOrigin'),
      config.get<string>('telegramMiniAppUrl'),
      'http://localhost:5173',
      'https://localhost:5173',
    ]
      .filter(Boolean)
      .map((value) => {
        try {
          return new URL(value!).origin;
        } catch {
          return value!.replace(/\/+$/, '');
        }
      }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  });
  app.useGlobalPipes(createValidationPipe());

  const port = config.get<number>('port') ?? 3000;
  await app.listen(port);
}

void bootstrap();
