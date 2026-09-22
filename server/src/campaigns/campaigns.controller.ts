import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';
import { CampaignsService } from './campaigns.service';
import { CampaignFilterDto } from './dto/campaign-filter.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaigns: CampaignsService) {}

  @Public()
  @Get()
  findAll(@Query() filter: CampaignFilterDto) {
    return this.campaigns.findAll(filter);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaigns.findById(id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() dto: CreateCampaignDto) {
    return this.campaigns.create(dto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaigns.update(id, dto);
  }

  @Roles(Role.Admin)
  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: UpdateCampaignStatusDto) {
    return this.campaigns.setStatus(id, dto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.campaigns.remove(id);
  }
}
