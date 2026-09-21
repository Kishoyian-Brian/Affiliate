export type NotificationType =
  | 'reward_held'
  | 'reward_released'
  | 'verification_failed'
  | 'withdrawal'
  | 'referral'
  | 'system'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  read: boolean
  href?: string
}
