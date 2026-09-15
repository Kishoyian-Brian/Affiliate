import { copyToClipboard, haptic, shareReferralLink } from '../../lib/telegram'
import { useToast } from '../../hooks/useToast'

interface ReferralLinkCardProps {
  referralLink: string
  taskTitle: string
  shareText?: string
  hideLink?: boolean
}

export function ReferralLinkCard({
  referralLink,
  taskTitle,
  shareText,
  hideLink = false,
}: ReferralLinkCardProps) {
  const { toast } = useToast()

  async function handleCopy() {
    const copied = await copyToClipboard(referralLink)
    if (copied) {
      haptic('success')
      toast('Invite ready', 'success')
      return
    }

    haptic('error')
    toast('Could not copy the invite', 'error')
  }

  function handleShare() {
    haptic('light')
    shareReferralLink(
      referralLink,
      shareText ?? `Join ${taskTitle} — verified subscription task.`,
    )
  }

  return (
    <div>
      {hideLink ? null : (
        <div className="referral-link-field">
          <input type="text" readOnly value={referralLink} aria-label="Referral link" />
          <button type="button" className="btn btn-secondary" onClick={() => void handleCopy()}>
            Copy
          </button>
        </div>
      )}
      <button type="button" className="btn btn-primary btn-block" onClick={handleShare}>
        {hideLink ? 'Invite a friend' : 'Share link'}
      </button>
    </div>
  )
}
