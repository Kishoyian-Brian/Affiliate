import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastViewport, type ToastItem, type ToastTone } from '../components/ui/ToastViewport'

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void
  confirm: (message: string) => Promise<boolean>
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const pendingConfirms = useRef(new Map<string, (accepted: boolean) => void>())

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      setToasts((current) => [...current, { id, message, tone }])
      window.setTimeout(() => dismiss(id), 3200)
    },
    [dismiss],
  )

  const confirm = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    for (const [pendingId, resolvePending] of pendingConfirms.current) {
      pendingConfirms.current.delete(pendingId)
      resolvePending(false)
    }
    return new Promise<boolean>((resolve) => {
      pendingConfirms.current.set(id, resolve)
      const finish = (accepted: boolean) => {
        pendingConfirms.current.delete(id)
        dismiss(id)
        resolve(accepted)
      }
      setToasts((current) => [
        ...current.filter((item) => !item.confirm),
        {
          id,
          message,
          tone: 'error',
          confirm: {
            onConfirm: () => finish(true),
            onCancel: () => finish(false),
          },
        },
      ])
    })
  }, [dismiss])

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
