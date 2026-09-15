import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
@UseGuards(AdminGuard)
export class AdminsController {
  constructor(private readonly admins: AdminsService) {}

  @Get()
  findAll() {
    return this.admins.findAll();
  }

  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.admins.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.admins.update(id, dto);
  }
}
