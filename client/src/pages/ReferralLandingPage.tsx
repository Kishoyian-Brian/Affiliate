import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerReferral } from '../lib/api'
import { useTelegram } from '../hooks/useTelegram'

export function ReferralLandingPage() {
  const navigate = useNavigate()
  const { startParam, initData } = useTelegram()

  useEffect(() => {
    if (!startParam) return

    void registerReferral(startParam.taskId, startParam.referrerId ?? '', initData).finally(() => {
      navigate(`/app/tasks/${startParam.taskId}`, { replace: true })
    })
  }, [initData, navigate, startParam])

  if (!startParam) {
    return (
      <section className="page">
        <div className="empty-state">
          <h3>Welcome</h3>
          <p>Open a referral link from a friend to join a campaign.</p>
          <Link to="/app" className="btn btn-primary">
            Browse tasks
          </Link>
        </div>
      </section>
    )
  }

  return <div className="state-block">Opening your task…</div>
}
