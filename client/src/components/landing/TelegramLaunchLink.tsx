import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getTelegramMiniAppUrl } from '../../lib/telegram'

interface TelegramLaunchLinkProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function TelegramLaunchLink({ children, className, style }: TelegramLaunchLinkProps) {
  const { ready, isInsideTelegram } = useAuth()

  if (ready && isInsideTelegram) {
    return (
      <Link to="/app" className={className} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <a className={className} href={getTelegramMiniAppUrl()} style={style}>
      {children}
    </a>
  )
}
