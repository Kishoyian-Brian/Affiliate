import { ApiError } from '../../lib/errors'
import { normalizeApiBase } from '../../lib/api'
import { getAdminAccessToken } from './auth'
import type {
  AdminCampaign,
  AdminWithdrawal,
  CampaignCompletion,
  CampaignInput,
  CampaignStatus,
  ChannelRecord,
  DashboardStats,
  EarnerUser,
} from '../types'

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL)

function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getAdminAccessToken()
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

async function adminFetch<T>(path: string, init: RequestInit | undefined, fallback: string): Promise<T> {
  const token = getAdminAccessToken()
  if (!token) {
    throw new ApiError('Sign in to continue')
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: authHeaders(init?.headers),
  })

  if (!response.ok) {
    throw new ApiError(await parseError(response, fallback))
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export async function fetchDashboard(): Promise<DashboardStats> {
  return adminFetch('/api/v1/admin/dashboard', undefined, 'Could not load dashboard')
}

export async function fetchCampaigns(): Promise<AdminCampaign[]> {
  return adminFetch('/api/v1/admin/campaigns', undefined, 'Could not load campaigns')
}

export async function fetchCampaign(id: string): Promise<AdminCampaign | undefined> {
  const token = getAdminAccessToken()
  if (!token) throw new ApiError('Sign in to continue')

  const response = await fetch(`${API_BASE}/api/v1/admin/campaigns/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  })

  if (response.status === 404) return undefined
  if (!response.ok) {
    throw new ApiError(await parseError(response, 'Could not load campaign'))
  }

  return (await response.json()) as AdminCampaign
}

export async function fetchCampaignCompletions(campaignId: string): Promise<CampaignCompletion[]> {
  return adminFetch(
    `/api/v1/admin/campaigns/${encodeURIComponent(campaignId)}/completions`,
    undefined,
    'Could not load completions',
  )
}

export async function createCampaign(input: CampaignInput): Promise<AdminCampaign> {
  return adminFetch('/api/v1/campaigns', {
    method: 'POST',
    body: JSON.stringify(input),
  }, 'Could not create campaign')
}

export async function updateCampaign(id: string, input: CampaignInput): Promise<AdminCampaign> {
  return adminFetch(
    `/api/v1/campaigns/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
    'Could not update campaign',
  )
}

export async function setCampaignStatus(id: string, status: CampaignStatus): Promise<void> {
  await adminFetch(
    `/api/v1/campaigns/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
    'Could not update campaign status',
  )
}

export async function fetchChannels(): Promise<ChannelRecord[]> {
  return adminFetch('/api/v1/channels', undefined, 'Could not load channels')
}

export async function testChannelBot(username: string): Promise<BotCheckResult> {
  return adminFetch(
    '/api/v1/channels/test-bot',
    {
      method: 'POST',
      body: JSON.stringify({ username }),
    },
    'Could not test bot access',
  )
}

export interface BotCheckResult {
  ok: boolean
  message: string
}

export async function fetchUsers(): Promise<EarnerUser[]> {
  return adminFetch('/api/v1/users', undefined, 'Could not load users')
}

export async function fetchWithdrawals(): Promise<AdminWithdrawal[]> {
  return adminFetch('/api/v1/withdrawals', undefined, 'Could not load withdrawals')
}

export async function updateWithdrawalStatus(
  id: string,
  status: AdminWithdrawal['status'],
): Promise<void> {
  await adminFetch(
    `/api/v1/withdrawals/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
    'Could not update withdrawal',
  )
}
