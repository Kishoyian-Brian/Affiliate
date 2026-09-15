import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.channel.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(dto: CreateChannelDto) {
    return this.prisma.channel.create({
      data: { username: dto.username.replace('@', ''), title: dto.title },
    });
  }

  update(id: string, dto: UpdateChannelDto) {
    return this.prisma.channel.update({ where: { id }, data: dto });
  }
}
