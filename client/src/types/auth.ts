import type { UserProfile } from './user'

export interface EarnerSession {
  user: UserProfile
  initData: string
  accessToken?: string
  refreshToken?: string
}

export interface TelegramAuthTokens {
  accessToken: string
  refreshToken: string
}
