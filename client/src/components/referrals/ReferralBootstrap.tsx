import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { registerReferral } from '../../lib/api'
import { useTelegram } from '../../hooks/useTelegram'

export function ReferralBootstrap() {
  const navigate = useNavigate()
  const { initData, isAuthenticated } = useAuth()
  const { ready, startParam } = useTelegram()

  useEffect(() => {
    if (!ready || !isAuthenticated || !startParam) return

    void registerReferral(startParam.taskId, startParam.referrerId ?? '', initData).finally(() => {
      navigate(`/app/tasks/${startParam.taskId}`, { replace: true })
    })
  }, [initData, isAuthenticated, navigate, ready, startParam])

  return null
}
