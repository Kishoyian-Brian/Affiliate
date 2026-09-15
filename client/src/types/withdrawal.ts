export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type PayoutMethod = 'ton' | 'usdt' | 'telegram_stars'

export interface WithdrawalEntry {
  id: string
  amount: number
  currency: string
  method: PayoutMethod
  status: WithdrawalStatus
  destination: string
  requestedAt: string
  completedAt?: string
  fee: number
}
