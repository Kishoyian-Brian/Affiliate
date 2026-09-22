import type { VerifySubscriptionResult } from '../types/api'
import type { TelegramAuthTokens } from '../types/auth'
import type { LeaderboardEntry } from '../types/leaderboard'
import type { AppNotification } from '../types/notification'
import type { ProfileData } from '../types/user'
import type { ReferralProgress, ReferralRecord } from '../types/referral'
import type { Task, TaskCompletion } from '../types/task'
import type { ConnectedWallet, WalletData } from '../types/wallet'
import type { PayoutMethod } from '../types/withdrawal'
import { ApiError } from './errors'
import { getAccessToken } from './auth'

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL)

function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getAccessToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function parseError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(body.message)) return body.message.join(', ')
    if (typeof body.message === 'string') return body.message
  } catch {
    /* ignore */
  }
  return fallback
}

async function requireAuthFetch(path: string, init?: RequestInit, fallback = 'Request failed') {
  const token = getAccessToken()
  if (!token) {
    throw new ApiError('Sign in through Telegram to continue')
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: authHeaders(init?.headers),
  })

  if (!response.ok) {
    throw new ApiError(await parseError(response, fallback))
  }

  if (response.status === 204) return undefined
  return response.json()
}

export async function telegramLogin(initData: string): Promise<TelegramAuthTokens> {
  const response = await fetch(`${API_BASE}/api/v1/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData }),
  })

  if (!response.ok) {
    throw new ApiError(await parseError(response, 'Could not verify Telegram login'))
  }

  return (await response.json()) as TelegramAuthTokens
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/api/v1/campaigns?status=active`, {
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new ApiError(await parseError(response, 'Could not load campaigns'))
  }

  return (await response.json()) as Task[]
}

export async function fetchTask(taskId: string): Promise<Task | undefined> {
  const response = await fetch(`${API_BASE}/api/v1/campaigns/${taskId}`, {
    headers: authHeaders(),
  })

  if (response.status === 404) return undefined

  if (!response.ok) {
    throw new ApiError(await parseError(response, 'Could not load campaign'))
  }

  return (await response.json()) as Task
}

export async function fetchCompletion(taskId: string): Promise<TaskCompletion | undefined> {
  const data = (await requireAuthFetch(
    `/api/v1/tasks/me/completions/${encodeURIComponent(taskId)}`,
    undefined,
    'Could not load completion',
  )) as TaskCompletion | null

  return data ?? undefined
}

export async function fetchAllCompletions(): Promise<Record<string, TaskCompletion>> {
  const token = getAccessToken()
  if (!token) return {}

  return (await requireAuthFetch(
    '/api/v1/tasks/me/completions',
    undefined,
    'Could not load completions',
  )) as Record<string, TaskCompletion>
}

export async function verifySubscription(
  taskId: string,
  _initData: string,
): Promise<VerifySubscriptionResult> {
  return (await requireAuthFetch(
    '/api/v1/tasks/verify',
    {
      method: 'POST',
      body: JSON.stringify({ campaignId: taskId }),
    },
    'Could not verify subscription',
  )) as VerifySubscriptionResult
}

export async function registerReferral(
  taskId: string,
  referrerId: string,
  _initData: string,
): Promise<void> {
  if (!taskId || !referrerId) return

  try {
    await requireAuthFetch(
      '/api/v1/referrals',
      {
        method: 'POST',
        body: JSON.stringify({ campaignId: taskId, referrerId }),
      },
      'Could not register referral',
    )
  } catch {
    // Deep-link bootstrap should still open the task if attribution fails.
  }
}

export async function fetchReferralProgress(taskId: string): Promise<ReferralProgress | undefined> {
  return (await requireAuthFetch(
    `/api/v1/referrals/progress?campaignId=${encodeURIComponent(taskId)}`,
    undefined,
    'Could not load referral progress',
  )) as ReferralProgress
}

export async function fetchReferralHistory(taskId: string): Promise<ReferralRecord[]> {
  return (await requireAuthFetch(
    `/api/v1/referrals/history?campaignId=${encodeURIComponent(taskId)}`,
    undefined,
    'Could not load referral history',
  )) as ReferralRecord[]
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  return (await requireAuthFetch(
    '/api/v1/leaderboards',
    undefined,
    'Could not load leaderboard',
  )) as LeaderboardEntry[]
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  return (await requireAuthFetch(
    '/api/v1/notifications',
    undefined,
    'Could not load notifications',
  )) as AppNotification[]
}

export async function fetchProfile(): Promise<ProfileData> {
  return (await requireAuthFetch(
    '/api/v1/users/me',
    undefined,
    'Could not load profile',
  )) as ProfileData
}

export async function fetchWallet(): Promise<WalletData> {
  return (await requireAuthFetch(
    '/api/v1/wallets/me',
    undefined,
    'Could not load wallet',
  )) as WalletData
}

export async function createTonProofPayload(): Promise<{ payload: string; expiresAt: string }> {
  return (await requireAuthFetch(
    '/api/v1/wallets/ton-proof/payload',
    { method: 'POST' },
    'Could not start wallet proof',
  )) as { payload: string; expiresAt: string }
}

export async function connectTonWallet(body: {
  address: string
  network: string
  publicKey: string
  proof: {
    timestamp: number
    domain: { lengthBytes: number; value: string }
    signature: string
    payload: string
    state_init?: string
  }
  walletApp?: string
}): Promise<ConnectedWallet> {
  return (await requireAuthFetch(
    '/api/v1/wallets/connect/ton',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    'Could not bind TON wallet',
  )) as ConnectedWallet
}

export async function disconnectTonWallet(): Promise<void> {
  await requireAuthFetch(
    '/api/v1/wallets/connect/ton',
    { method: 'DELETE' },
    'Could not disconnect wallet',
  )
}

export async function requestWithdrawal(
  amount: number,
  method: PayoutMethod,
  destination: string,
): Promise<WalletData> {
  await requireAuthFetch(
    '/api/v1/withdrawals',
    {
      method: 'POST',
      body: JSON.stringify({ amount, method, destination }),
    },
    'Withdrawal failed',
  )

  return fetchWallet()
}

export function normalizeApiBase(value?: string) {
  const raw = (value?.trim() || 'http://localhost:3000').replace(/\/+$/, '')
  return raw.replace(/\/api(?:\/v1)?$/i, '')
}

export function getApiBaseUrl() {
  return API_BASE
}
