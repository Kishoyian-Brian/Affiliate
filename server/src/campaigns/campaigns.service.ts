import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CampaignFilterDto } from './dto/campaign-filter.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filter: CampaignFilterDto) {
    return this.prisma.campaign.findMany({
      where: {
        status: filter.status as never,
        type: filter.type as never,
      },
      include: { channel: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.campaign.findUnique({ where: { id }, include: { channel: true } });
  }

  create(_dto: CreateCampaignDto) {
    return Promise.reject(new Error('Campaign create is not wired yet'));
  }

  update(id: string, dto: UpdateCampaignDto) {
    return this.prisma.campaign.update({ where: { id }, data: dto as never });
  }

  setStatus(id: string, dto: UpdateCampaignStatusDto) {
    return this.prisma.campaign.update({ where: { id }, data: { status: dto.status } });
  }
}
