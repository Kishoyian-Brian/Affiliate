import { Link } from 'react-router-dom'

interface LogoProps {
  to?: string
  className?: string
}

export function Logo({ to = '/', className = 'brand-logo' }: LogoProps) {
  const content = (
    <>
      <span className="brand-logo-mark" aria-hidden="true">
        T
      </span>
      <span>Tasklane</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
