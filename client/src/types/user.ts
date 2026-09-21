export interface UserProfile {
  id?: string
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
  tonAddress?: string
  tonConnectedAt?: string
}

export interface ProfileActivityItem {
  id: string
  type: 'task_completed' | 'reward_released' | 'referral_verified' | 'withdrawal'
  label: string
  date: string
}

export interface ProfileData {
  user: UserProfile
  recentActivity: ProfileActivityItem[]
}
