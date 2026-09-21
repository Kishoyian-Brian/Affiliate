import type { TaskType } from './task'
import type { WithdrawalEntry } from './withdrawal'

export type RewardStatus = 'none' | 'pending' | 'held' | 'released' | 'cancelled'

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

export interface WalletSummary {
  availableBalance: number
  pendingBalance: number
  lifetimeEarned: number
  lifetimeWithdrawn: number
  currency: string
  minWithdrawal: number
  withdrawalFeePct: number
}

export interface ConnectedWallet {
  address: string
  network: string
  walletApp?: string
  connectedAt: string | null
}

export interface WalletData {
  summary: WalletSummary
  connectedWallet: ConnectedWallet | null
  rewards: RewardEntry[]
  withdrawals: WithdrawalEntry[]
}
