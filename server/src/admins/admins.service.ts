import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findByEmail(email: string) {
    return this.prisma.adminUser.findUnique({ where: { email } });
  }

  create(dto: CreateAdminDto) {
    return this.prisma.adminUser.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: dto.password,
      },
    });
  }

  update(id: string, dto: UpdateAdminDto) {
    return this.prisma.adminUser.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: dto.password,
      },
    });
  }
}
