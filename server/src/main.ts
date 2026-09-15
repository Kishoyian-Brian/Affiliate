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
  app.enableCors({
    origin: config.get<string>('clientOrigin') ?? 'http://localhost:5173',
    credentials: true,
  });
  app.useGlobalPipes(createValidationPipe());

  const port = config.get<number>('port') ?? 3000;
  await app.listen(port);
}

void bootstrap();
