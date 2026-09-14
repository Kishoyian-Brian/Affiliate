import { useState } from 'react'
import type { ReferralProgress } from '../../types'
import { ProgressBar } from '../ui/ProgressBar'
import { copyToClipboard, haptic, shareReferralLink } from '../../lib/telegram'

interface ReferralPanelProps {
  progress: ReferralProgress
  taskTitle: string
}

export function ReferralPanel({ progress, taskTitle }: ReferralPanelProps) {
  const [copied, setCopied] = useState(false)
  const remaining = Math.max(0, progress.target - progress.verifiedCount)

  async function handleCopy() {
    await copyToClipboard(progress.referralLink)
    haptic('success')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  function handleShare() {
    haptic('light')
    shareReferralLink(progress.referralLink, `Join ${taskTitle} — verified subscription task.`)
  }

  return (
    <section className="section-card referral-panel">
      <header className="section-header">
        <h2>Referral progress</h2>
        <p>Only independently verified subscribers count.</p>
      </header>

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

      <div className="referral-link-field">
        <input type="text" readOnly value={progress.referralLink} aria-label="Referral link" />
        <button type="button" className="btn btn-secondary" onClick={() => void handleCopy()}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <button type="button" className="btn btn-primary btn-block" onClick={handleShare}>
        Share link
      </button>
    </section>
  )
}
