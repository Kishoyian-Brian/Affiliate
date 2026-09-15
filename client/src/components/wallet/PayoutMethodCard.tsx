import type { PayoutMethod } from '../../types/withdrawal'

const methods: Array<{ id: PayoutMethod; label: string; placeholder: string }> = [
  { id: 'ton', label: 'TON', placeholder: 'UQ... wallet address' },
  { id: 'usdt', label: 'USDT', placeholder: 'TRC20 or ERC20 address' },
  { id: 'telegram_stars', label: 'Telegram Stars', placeholder: 'Your Telegram @username' },
]

interface PayoutMethodCardProps {
  method: PayoutMethod
  onChange: (method: PayoutMethod) => void
}

export function PayoutMethodCard({ method, onChange }: PayoutMethodCardProps) {
  return (
    <div className="withdraw-methods" role="tablist" aria-label="Payout methods">
      {methods.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={method === item.id}
          className={method === item.id ? 'withdraw-method active' : 'withdraw-method'}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function payoutMethodMeta(method: PayoutMethod) {
  return methods.find((item) => item.id === method)!
}
