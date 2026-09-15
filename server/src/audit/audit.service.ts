import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  record(actorId: string, action: string, metadata?: Record<string, unknown>) {
    this.logger.log(`${actorId} ${action}`);
    return { actorId, action, metadata, at: new Date().toISOString() };
  }

  findAll() {
    return [];
  }
}
