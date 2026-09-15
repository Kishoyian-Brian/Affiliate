export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected'

export interface AdminWithdrawal {
  id: string
  userId: string
  telegramId: number
  displayName: string
  amount: number
  currency: string
  method: 'ton' | 'usdt' | 'telegram_stars'
  destination: string
  status: WithdrawalStatus
  requestedAt: string
  fee: number
}
