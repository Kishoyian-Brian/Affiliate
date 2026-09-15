import { copyToClipboard, haptic, shareReferralLink } from '../../lib/telegram'
import { useToast } from '../../hooks/useToast'

interface ReferralLinkCardProps {
  referralLink: string
  taskTitle: string
}

export function ReferralLinkCard({ referralLink, taskTitle }: ReferralLinkCardProps) {
  const { toast } = useToast()

  async function handleCopy() {
    const copied = await copyToClipboard(referralLink)
    if (copied) {
      haptic('success')
      toast('Link copied', 'success')
      return
    }

    haptic('error')
    toast('Could not copy the link', 'error')
  }

  function handleShare() {
    haptic('light')
    shareReferralLink(referralLink, `Join ${taskTitle} — verified subscription task.`)
  }

  return (
    <div>
      <div className="referral-link-field">
        <input type="text" readOnly value={referralLink} aria-label="Referral link" />
        <button type="button" className="btn btn-secondary" onClick={() => void handleCopy()}>
          Copy
        </button>
      </div>
      <button type="button" className="btn btn-primary btn-block" onClick={handleShare}>
        Share link
      </button>
    </div>
  )
}
