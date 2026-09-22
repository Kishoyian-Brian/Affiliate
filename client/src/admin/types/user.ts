export interface AdminSession {
  id: string
  name: string
  email: string
  accessToken: string
  refreshToken: string
}

export interface EarnerUser {
  id: string
  telegramId: number
  username?: string
  displayName: string
  balance: number
  pendingBalance: number
  currency: string
  completedTasks: number
  accountStatus: 'active' | 'restricted'
  memberSince: string
}
