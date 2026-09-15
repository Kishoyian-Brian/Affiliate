export type CampaignStatus = 'draft' | 'active' | 'paused' | 'ended'

export type CampaignType = 'subscribe' | 'referral' | 'affiliate'

export type BotAccessStatus = 'unknown' | 'ok' | 'failed'

export type CompletionStatus =
  | 'awaiting_verification'
  | 'verified_pending'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface ChannelRecord {
  id: string
  username: string
  title: string
  memberCount: number
  botAccess: BotAccessStatus
  lastCheckedAt?: string
  campaignCount: number
}

export interface CampaignRequirements {
  mustStaySubscribed: boolean
  holdHours: number
  newMembersOnly: boolean
  minAccountAgeDays?: number
  maxCompletionsPerUser: number
}

export interface CampaignStats {
  started: number
  verified: number
  onHold: number
  completed: number
  failed: number
  cancelled: number
}

export interface AdminCampaign {
  id: string
  title: string
  shortDescription: string
  description: string
  type: CampaignType
  channelUsername: string
  channelTitle: string
  channelMemberCount: number
  sponsorName: string
  rewardAmount: number
  rewardCurrency: string
  referralTarget?: number
  affiliateUrl?: string
  holdHours: number
  slotsTotal: number
  slotsRemaining: number
  requirements: CampaignRequirements
  rules: string[]
  status: CampaignStatus
  startAt: string
  endAt: string
  createdAt: string
  updatedAt: string
  stats: CampaignStats
}

export interface CampaignCompletion {
  id: string
  campaignId: string
  telegramId: number
  username?: string
  displayName: string
  status: CompletionStatus
  verifiedAt?: string
  holdReleaseAt?: string
  rewardAmount: number
  currency: string
}

export interface CampaignInput {
  title: string
  shortDescription: string
  description: string
  type: CampaignType
  channelUsername: string
  channelTitle: string
  channelMemberCount: number
  sponsorName: string
  rewardAmount: number
  rewardCurrency: string
  referralTarget?: number
  affiliateUrl?: string
  holdHours: number
  slotsTotal: number
  requirements: CampaignRequirements
  rules: string[]
  status: CampaignStatus
  startAt: string
  endAt: string
}
