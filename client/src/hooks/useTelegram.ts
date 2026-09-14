import { useEffect, useMemo, useState } from 'react'
import {
  getInitData,
  getStartParam,
  getTelegramUser,
  initTelegramApp,
  parseStartParam,
} from '../lib/telegram'
import { mockUser } from '../data/mock'

export function useTelegram() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initTelegramApp()
    setReady(true)
  }, [])

  const telegramUser = getTelegramUser()
  const startParam = parseStartParam(getStartParam())

  const user = useMemo(() => {
    if (telegramUser) {
      return {
        ...mockUser,
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        username: telegramUser.username,
      }
    }

    return mockUser
  }, [telegramUser])

  return {
    ready,
    user,
    initData: getInitData(),
    startParam,
  }
}
