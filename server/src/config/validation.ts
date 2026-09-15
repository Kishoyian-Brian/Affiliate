import { plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  @IsInt()
  @Min(1)
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsOptional()
  @IsString()
  TELEGRAM_BOT_TOKEN: string = '';

  @IsOptional()
  @IsString()
  TELEGRAM_BOT_USERNAME: string = 'tasklane_bot';

  @IsOptional()
  @IsString()
  TELEGRAM_CHANNEL_USERNAME: string = 'TasklaneSupport';

  @IsOptional()
  @IsString()
  TELEGRAM_CHANNEL_URL: string = '';

  @IsOptional()
  @IsString()
  TELEGRAM_WEBHOOK_URL: string = '';

  @IsOptional()
  @IsString()
  TELEGRAM_MINI_APP_URL: string = 'https://client-psi-six-83.vercel.app';

  @IsOptional()
  @IsString()
  CLIENT_ORIGIN: string = 'http://localhost:5173';

  @IsOptional()
  @IsString()
  ADMIN_JWT_SECRET: string = '';

  @IsOptional()
  @IsString()
  JWT_SECRET: string = '';

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN: string = '7d';
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}
