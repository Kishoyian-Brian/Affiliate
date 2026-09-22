import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';
import { CampaignsService } from '../campaigns/campaigns.service';
import { AdminService } from './admin.service';

@Controller('admin')
@Roles(Role.Admin)
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly campaigns: CampaignsService,
  ) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  @Get('campaigns')
  campaignsList() {
    return this.campaigns.adminFindAll();
  }

  @Get('campaigns/:id/completions')
  completions(@Param('id') id: string) {
    return this.campaigns.completions(id);
  }

  @Get('campaigns/:id')
  campaign(@Param('id') id: string) {
    return this.campaigns.adminFindById(id);
  }
}
