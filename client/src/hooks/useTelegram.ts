import { useEffect, useState } from 'react'
import { emptyProfileFromTelegram } from '../lib/auth'
import {
  getInitData,
  getStartParam,
  getTelegramUser,
  initTelegramApp,
  isInsideTelegram as detectTelegram,
  parseStartParam,
} from '../lib/telegram'
import type { UserProfile } from '../types/user'

function readTelegramSession() {
  const inside = detectTelegram()
  if (!inside) {
    return { inside: false, user: null as UserProfile | null, initData: '', startParam: null }
  }

  const telegramUser = getTelegramUser()
  return {
    inside: true,
    user: telegramUser ? emptyProfileFromTelegram(telegramUser) : null,
    initData: getInitData(),
    startParam: parseStartParam(getStartParam()),
  }
}

export function useTelegram() {
  const [session, setSession] = useState(readTelegramSession)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initTelegramApp()
    setSession(readTelegramSession())
    setReady(true)
  }, [])

  return {
    ready,
    user: session.user,
    initData: session.initData,
    startParam: session.startParam,
    isInsideTelegram: session.inside,
  }
}
