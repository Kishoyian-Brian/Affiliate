import type { CompletionStatus, RewardStatus } from '../../types'

const completionLabels: Record<CompletionStatus, string> = {
  not_started: 'Not started',
  awaiting_verification: 'Awaiting verify',
  verifying: 'Verifying',
  verified_pending: 'On hold',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
}

const rewardLabels: Record<RewardStatus, string> = {
  none: '',
  pending: 'Pending',
  held: 'On hold',
  released: 'Paid',
  cancelled: 'Cancelled',
}

interface StatusBadgeProps {
  status: CompletionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className="badge">{completionLabels[status]}</span>
}

interface RewardBadgeProps {
  status: RewardStatus
}

export function RewardBadge({ status }: RewardBadgeProps) {
  if (status === 'none') return null

  return <span className="badge">{rewardLabels[status]}</span>
}
