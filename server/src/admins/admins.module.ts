import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { AdminGuard } from './guards/admin.guard';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService, AdminGuard],
  exports: [AdminsService],
})
export class AdminsModule {}
