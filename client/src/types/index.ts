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

export type RewardStatus = 'none' | 'pending' | 'held' | 'released' | 'cancelled'

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed'

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

export interface ReferralProgress {
  taskId: string
  target: number
  verifiedCount: number
  pendingCount: number
  rejectedCount: number
  referralLink: string
}

export interface RewardEntry {
  id: string
  taskId: string
  taskTitle: string
  taskType: TaskType
  amount: number
  currency: string
  status: RewardStatus
  createdAt: string
  verifiedAt?: string
  holdReleaseAt?: string
  releasedAt?: string
  cancelledAt?: string
  note?: string
}

export interface WithdrawalEntry {
  id: string
  amount: number
  currency: string
  method: 'ton' | 'usdt' | 'telegram_stars'
  status: WithdrawalStatus
  destination: string
  requestedAt: string
  completedAt?: string
  fee: number
}

export interface WalletSummary {
  availableBalance: number
  pendingBalance: number
  lifetimeEarned: number
  lifetimeWithdrawn: number
  currency: string
  minWithdrawal: number
  withdrawalFeePct: number
}

export interface UserProfile {
  telegramId: number
  firstName: string
  lastName?: string
  username?: string
  balance: number
  pendingBalance: number
  currency: string
  completedTasks: number
  activeReferrals: number
  memberSince: string
  totalEarned: number
  accountStatus: 'active' | 'restricted' | 'pending'
  language: string
}

export interface ProfileData {
  user: UserProfile
  recentActivity: ProfileActivityItem[]
}

export interface ProfileActivityItem {
  id: string
  type: 'task_completed' | 'reward_released' | 'referral_verified' | 'withdrawal'
  label: string
  date: string
}

export interface VerifySubscriptionResult {
  success: boolean
  completionStatus: CompletionStatus
  rewardStatus: RewardStatus
  holdReleaseAt?: string
  message: string
}

export interface WalletData {
  summary: WalletSummary
  rewards: RewardEntry[]
  withdrawals: WithdrawalEntry[]
}
