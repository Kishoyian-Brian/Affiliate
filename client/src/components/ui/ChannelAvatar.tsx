interface ChannelAvatarProps {
  name: string
  size?: 'sm' | 'md'
}

export function getChannelInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function ChannelAvatar({ name, size = 'sm' }: ChannelAvatarProps) {
  return (
    <div className={`channel-avatar channel-avatar-${size}`} aria-hidden="true">
      {getChannelInitials(name)}
    </div>
  )
}
