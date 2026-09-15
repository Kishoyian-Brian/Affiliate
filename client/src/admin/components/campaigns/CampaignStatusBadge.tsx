import type { CampaignStatus } from '../../types'

const labels: Record<CampaignStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  ended: 'Ended',
}

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return <span className={`admin-badge admin-badge-${status}`}>{labels[status]}</span>
}
