import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';
import { AuditService } from './audit.service';

@Controller('audit')
@Roles(Role.Admin)
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  findAll() {
    return this.audit.findAll();
  }
}
