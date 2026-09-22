import type { ReferralProgress } from '../../types/referral'
import { formatMoney } from '../../lib/format'
import { ProgressBar } from '../ui/ProgressBar'

interface ReferralStatsProps {
  progress: ReferralProgress
  perConversion?: boolean
  rewardAmount?: number
  rewardCurrency?: string
}

export function ReferralStats({
  progress,
  perConversion,
  rewardAmount = 0,
  rewardCurrency = 'USD',
}: ReferralStatsProps) {
  if (perConversion || progress.target <= 0) {
    return (
      <p className="referral-remaining">
        {progress.verifiedCount} qualified · {progress.pendingCount} pending · {progress.rejectedCount}{' '}
        rejected. Each qualified player pays {formatMoney(rewardAmount, rewardCurrency)}.
      </p>
    )
  }

  const remaining = Math.max(0, progress.target - progress.verifiedCount)

  return (
    <>
      <ProgressBar
        value={progress.verifiedCount}
        max={progress.target}
        label={`${progress.verifiedCount} verified · ${progress.pendingCount} pending · ${progress.rejectedCount} rejected`}
      />
      <p className="referral-remaining">
        {remaining === 0
          ? 'Milestone reached. Reward subject to hold period.'
          : `${remaining} more verified subscriber${remaining === 1 ? '' : 's'} required.`}
      </p>
    </>
  )
}
