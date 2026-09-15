import type { RewardStatus } from './wallet'

export type TaskType = 'subscribe' | 'referral'

export type TaskStatus = 'active' | 'paused' | 'ended'

export type TaskCategory = 'crypto' | 'tech' | 'trading' | 'news' | 'community'

export type TaskDifficulty = 'easy' | 'medium' | 'hard'

export type CompletionStatus =
  | 'not_started'
  | 'awaiting_verification'
  | 'verifying'
  | 'verified_pending'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface TaskRequirements {
  mustStaySubscribed: boolean
  holdHours: number
  newMembersOnly: boolean
  minAccountAgeDays?: number
  allowedCountries?: string[]
  maxCompletionsPerUser: number
}

export interface Task {
  id: string
  title: string
  shortDescription: string
  description: string
  type: TaskType
  category: TaskCategory
  difficulty: TaskDifficulty
  channelUsername: string
  channelTitle: string
  channelMemberCount: number
  channelDescription: string
  sponsorName: string
  rewardAmount: number
  rewardCurrency: string
  rewardLabel: string
  referralTarget?: number
  referralRewardPerUser?: number
  holdHours: number
  estimatedMinutes: number
  slotsTotal: number
  slotsRemaining: number
  requirements: TaskRequirements
  rules: string[]
  tags: string[]
  startAt: string
  endAt: string
  status: TaskStatus
}

export interface TaskCompletion {
  taskId: string
  status: CompletionStatus
  rewardStatus: RewardStatus
  verifiedAt?: string
  holdReleaseAt?: string
  failureReason?: string
}
