type NavIconName = 'tasks' | 'wallet' | 'profile' | 'leaderboard' | 'notifications'

interface NavIconProps {
  name: NavIconName
  className?: string
}

export function NavIcon({ name, className = 'nav-icon' }: NavIconProps) {
  const paths = {
    tasks: (
      <>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </>
    ),
    wallet: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 16.5v-9Z" />
        <path d="M17 12h2.5a1.5 1.5 0 0 0 0-3H17" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 19.5c0-3.5 3.1-6 7-6s7 2.5 7 6" />
      </>
    ),
    leaderboard: (
      <>
        <path d="M8 21V10M12 21V3M16 21v-6" />
      </>
    ),
    notifications: (
      <>
        <path d="M18 8A6 6 0 1 0 6 8c0 7-3 8-3 8h18s-3-1-3-8" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
