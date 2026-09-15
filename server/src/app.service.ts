import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return { name: 'Tasklane API', version: '0.0.1' };
  }
}
