export type ToastTone = 'info' | 'success' | 'error'

export interface ToastItem {
  id: string
  message: string
  tone: ToastTone
  confirm?: {
    onConfirm: () => void
    onCancel: () => void
  }
}

export function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((item) => (
        <div key={item.id} className={`toast toast-${item.tone}`} role="status">
          <span>{item.message}</span>
          {item.confirm ? (
            <span className="toast-actions">
              <button type="button" className="toast-btn" onClick={item.confirm.onCancel}>
                Cancel
              </button>
              <button type="button" className="toast-btn toast-btn-danger" onClick={item.confirm.onConfirm}>
                Delete
              </button>
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
