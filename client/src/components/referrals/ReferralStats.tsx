import type { ReferralProgress } from '../../types/referral'
import { ProgressBar } from '../ui/ProgressBar'

interface ReferralStatsProps {
  progress: ReferralProgress
  perConversion?: boolean
}

export function ReferralStats({ progress, perConversion }: ReferralStatsProps) {
  if (perConversion || progress.target <= 0) {
    return (
      <p className="referral-remaining">
        {progress.verifiedCount} qualified · {progress.pendingCount} pending · {progress.rejectedCount}{' '}
        rejected. Each qualified player pays $40.
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
