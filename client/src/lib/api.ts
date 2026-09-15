import type { VerifySubscriptionResult } from '../types/api'
import type { LeaderboardEntry } from '../types/leaderboard'
import type { AppNotification } from '../types/notification'
import type { ProfileData } from '../types/user'
import type { ReferralProgress, ReferralRecord } from '../types/referral'
import type { Task, TaskCompletion } from '../types/task'
import type { WalletData } from '../types/wallet'
import type { PayoutMethod } from '../types/withdrawal'
import { ApiError } from './errors'
import {
  mockCompletions,
  mockLeaderboard,
  mockNotifications,
  mockProfile,
  mockReferralHistory,
  mockReferralProgress,
  mockTasks,
  mockWallet,
} from '../data/mock'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchTasks(): Promise<Task[]> {
  await delay(400)
  return mockTasks
}

export async function fetchTask(taskId: string): Promise<Task | undefined> {
  await delay(300)
  return mockTasks.find((task) => task.id === taskId)
}

export async function fetchCompletion(taskId: string): Promise<TaskCompletion | undefined> {
  await delay(200)
  return mockCompletions[taskId]
}

export async function fetchAllCompletions(): Promise<Record<string, TaskCompletion>> {
  await delay(200)
  return { ...mockCompletions }
}

export async function verifySubscription(
  taskId: string,
  _initData: string,
): Promise<VerifySubscriptionResult> {
  await delay(1200)

  const random = Math.random()
  if (random < 0.15) {
    return {
      success: false,
      completionStatus: 'failed',
      rewardStatus: 'none',
      message: 'We could not confirm your subscription. Join the channel first, then try again.',
    }
  }

  const task = mockTasks.find((item) => item.id === taskId)
  const holdReleaseAt = task
    ? new Date(Date.now() + task.holdHours * 60 * 60 * 1000).toISOString()
    : undefined

  mockCompletions[taskId] = {
    taskId,
    status: 'verified_pending',
    rewardStatus: 'held',
    verifiedAt: new Date().toISOString(),
    holdReleaseAt,
  }

  return {
    success: true,
    completionStatus: 'verified_pending',
    rewardStatus: 'held',
    holdReleaseAt,
    message: task
      ? `Verified! Reward unlocks after ${task.holdHours} hours if you stay subscribed.`
      : 'Verified! Your reward is pending.',
  }
}

export async function registerReferral(
  taskId: string,
  referrerId: string,
  _initData: string,
): Promise<void> {
  await delay(200)
  console.info('Referral registered', { taskId, referrerId })
}

export async function fetchReferralProgress(taskId: string): Promise<ReferralProgress | undefined> {
  await delay(200)
  return mockReferralProgress[taskId]
}

export async function fetchReferralHistory(taskId: string): Promise<ReferralRecord[]> {
  await delay(200)
  return mockReferralHistory.filter((item) => item.taskId === taskId)
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  await delay(300)
  return mockLeaderboard.map((entry) => ({ ...entry }))
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  await delay(250)
  return mockNotifications.map((item) => ({ ...item }))
}

export async function fetchProfile(): Promise<ProfileData> {
  await delay(300)
  return structuredClone(mockProfile)
}

export async function fetchWallet(): Promise<WalletData> {
  await delay(400)
  return structuredClone(mockWallet)
}

export async function requestWithdrawal(
  amount: number,
  method: PayoutMethod,
  destination: string,
): Promise<WalletData> {
  await delay(800)

  const { summary } = mockWallet

  if (amount < summary.minWithdrawal) {
    throw new ApiError(`Minimum withdrawal is ${summary.minWithdrawal} ${summary.currency}`)
  }

  if (amount > summary.availableBalance) {
    throw new ApiError('Insufficient available balance')
  }

  if (!destination.trim()) {
    throw new ApiError('Enter a payout destination')
  }

  const fee = Math.round(amount * (summary.withdrawalFeePct / 100) * 100) / 100

  mockWallet.summary.availableBalance = Math.round((summary.availableBalance - amount) * 100) / 100
  mockWallet.summary.lifetimeWithdrawn = Math.round((summary.lifetimeWithdrawn + amount) * 100) / 100
  mockWallet.withdrawals.unshift({
    id: `w${Date.now()}`,
    amount,
    currency: summary.currency,
    method,
    status: 'pending',
    destination: destination.trim(),
    requestedAt: new Date().toISOString(),
    fee,
  })

  return structuredClone(mockWallet)
}

export function getApiBaseUrl() {
  return API_BASE
}
