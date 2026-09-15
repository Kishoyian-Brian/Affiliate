import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  send(to: string, subject: string, body: string) {
    this.logger.log(`Email skipped (${to}): ${subject}`);
    return Promise.resolve({ to, subject, body, sent: false });
  }
}
