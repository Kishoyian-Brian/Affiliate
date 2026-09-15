import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

jest.mock('@nestjs/config', () => ({
  ConfigService: class ConfigService {},
}));

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn().mockResolvedValue(1) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        { provide: PrismaService, useValue: prisma },
        { provide: TelegramService, useValue: { isConfigured: () => false } },
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  it('returns ok when the database responds', async () => {
    await expect(controller.check()).resolves.toEqual({
      status: 'ok',
      db: 'up',
      telegram: 'missing_token',
    });
  });

  it('returns 503 when the database is down', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connect'));

    await expect(controller.check()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
