import type { CompletionStatus } from './task'
import type { RewardStatus } from './wallet'

export interface VerifySubscriptionResult {
  success: boolean
  completionStatus: CompletionStatus
  rewardStatus: RewardStatus
  holdReleaseAt?: string
  message: string
}

export interface ApiErrorBody {
  message: string
  code?: string
}
