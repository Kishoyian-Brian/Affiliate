export type ToastTone = 'info' | 'success' | 'error'

export interface ToastItem {
  id: string
  message: string
  tone: ToastTone
}

export function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((item) => (
        <p key={item.id} className={`toast toast-${item.tone}`} role="status">
          {item.message}
        </p>
      ))}
    </div>
  )
}
