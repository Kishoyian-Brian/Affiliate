import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { hashPassword } from '../common/utils/crypto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.adminUser.findUnique({ where: { email } });
  }

  create(dto: CreateAdminDto) {
    return this.prisma.adminUser.create({
      data: {
        name: dto.name,
        email: dto.email.trim().toLowerCase(),
        passwordHash: hashPassword(dto.password),
      },
    });
  }

  update(id: string, dto: UpdateAdminDto) {
    return this.prisma.adminUser.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email?.trim().toLowerCase(),
        ...(dto.password ? { passwordHash: hashPassword(dto.password) } : {}),
      },
    });
  }
}
