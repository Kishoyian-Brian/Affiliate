import type { ReferralProgress } from '../../types/referral'
import { ProgressBar } from '../ui/ProgressBar'

export function ReferralStats({ progress }: { progress: ReferralProgress }) {
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
