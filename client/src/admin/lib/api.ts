import {
  mockCampaigns,
  mockChannels,
  mockCompletions,
  mockDashboard,
  mockUsers,
  mockWithdrawals,
} from '../data/mock'
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchDashboard(): Promise<DashboardStats> {
  await delay(300)
  return { ...mockDashboard }
}

export async function fetchCampaigns(): Promise<AdminCampaign[]> {
  await delay(350)
  return mockCampaigns.map((c) => ({ ...c, stats: { ...c.stats } }))
}

export async function fetchCampaign(id: string): Promise<AdminCampaign | undefined> {
  await delay(250)
  const campaign = mockCampaigns.find((c) => c.id === id)
  return campaign ? { ...campaign, stats: { ...campaign.stats } } : undefined
}

export async function fetchCampaignCompletions(campaignId: string): Promise<CampaignCompletion[]> {
  await delay(200)
  return mockCompletions.filter((c) => c.campaignId === campaignId)
}

export async function createCampaign(input: CampaignInput): Promise<AdminCampaign> {
  await delay(500)
  const id = String(Date.now())
  const campaign: AdminCampaign = {
    id,
    ...input,
    slotsRemaining: input.slotsTotal,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: { started: 0, verified: 0, onHold: 0, completed: 0, failed: 0, cancelled: 0 },
  }
  mockCampaigns.unshift(campaign)
  return { ...campaign }
}

export async function updateCampaign(id: string, input: CampaignInput): Promise<AdminCampaign> {
  await delay(500)
  const index = mockCampaigns.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Campaign not found')
  const existing = mockCampaigns[index]
  const updated: AdminCampaign = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  }
  mockCampaigns[index] = updated
  return { ...updated, stats: { ...updated.stats } }
}

export async function setCampaignStatus(id: string, status: CampaignStatus): Promise<void> {
  await delay(300)
  const campaign = mockCampaigns.find((c) => c.id === id)
  if (!campaign) throw new Error('Campaign not found')
  campaign.status = status
  campaign.updatedAt = new Date().toISOString()
}

export async function fetchChannels(): Promise<ChannelRecord[]> {
  await delay(300)
  return mockChannels.map((c) => ({ ...c }))
}

export async function testChannelBot(username: string): Promise<BotCheckResult> {
  await delay(800)
  const channel = mockChannels.find((c) => c.username === username.replace('@', ''))
  if (!channel) {
    return { ok: false, message: 'Channel not in registry. Add it when creating a campaign.' }
  }
  if (channel.botAccess === 'failed') {
    return {
      ok: false,
      message: 'Bot is not admin on this channel or lacks membership read access.',
    }
  }
  channel.lastCheckedAt = new Date().toISOString()
  channel.botAccess = 'ok'
  return { ok: true, message: 'Bot can verify membership on this channel.' }
}

export interface BotCheckResult {
  ok: boolean
  message: string
}

export async function fetchUsers(): Promise<EarnerUser[]> {
  await delay(300)
  return mockUsers.map((u) => ({ ...u }))
}

export async function fetchWithdrawals(): Promise<AdminWithdrawal[]> {
  await delay(300)
  return mockWithdrawals.map((w) => ({ ...w }))
}

export async function updateWithdrawalStatus(
  id: string,
  status: AdminWithdrawal['status'],
): Promise<void> {
  await delay(400)
  const withdrawal = mockWithdrawals.find((w) => w.id === id)
  if (!withdrawal) throw new Error('Withdrawal not found')
  withdrawal.status = status
}
