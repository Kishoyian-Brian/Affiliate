import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AdminsModule } from './admins/admins.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ChannelsModule } from './channels/channels.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import configuration from './config/configuration';
import { validate } from './config/validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ParticipationModule } from './participation/participation.module';
import { ReferralsModule } from './referrals/referrals.module';
import { RewardsModule } from './rewards/rewards.module';
import { TasksModule } from './tasks/tasks.module';
import { TelegramModule } from './telegram/telegram.module';
import { UsersModule } from './users/users.module';
import { VerificationsModule } from './verifications/verifications.module';
import { WalletsModule } from './wallets/wallets.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    DatabaseModule,
    TelegramModule,
    AuthModule,
    UsersModule,
    AdminsModule,
    AdminModule,
    CampaignsModule,
    TasksModule,
    ParticipationModule,
    ReferralsModule,
    LeaderboardsModule,
    ChannelsModule,
    WalletsModule,
    RewardsModule,
    WithdrawalsModule,
    VerificationsModule,
    NotificationsModule,
    AuditModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
