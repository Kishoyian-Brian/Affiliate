import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardCalculationService {
  holdReleaseAt(from: Date, holdHours: number) {
    return new Date(from.getTime() + holdHours * 60 * 60 * 1000);
  }
}
