import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerReferral } from '../lib/api'
import { useTelegram } from '../hooks/useTelegram'

export function ReferralBootstrap() {
  const navigate = useNavigate()
  const { ready, startParam, initData } = useTelegram()

  useEffect(() => {
    if (!ready || !startParam) return

    void registerReferral(startParam.taskId, startParam.referrerId ?? '', initData).finally(() => {
      navigate(`/app/tasks/${startParam.taskId}`, { replace: true })
    })
  }, [initData, navigate, ready, startParam])

  return null
}
