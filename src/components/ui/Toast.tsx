'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  onClose?: (id: string) => void
}

const variantStyles = {
  success: {
    container: 'bg-green-50 border-green-200',
    icon: '✓',
    iconColor: 'text-green-600 bg-green-100'
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: '✕',
    iconColor: 'text-red-600 bg-red-100'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: '!',
    iconColor: 'text-yellow-600 bg-yellow-100'
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'i',
    iconColor: 'text-blue-600 bg-blue-100'
  }
}

export function Toast({
  id,
  title,
  description,
  variant = 'info',
  duration = 5000,
  onClose
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const styles = variantStyles[variant]

  // useCallback para evitar dependência no useEffect
  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.(id)
    }, 200)
  }, [id, onClose])

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    // Auto dismiss
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval)
            return 0
          }
          return prev - (100 / (duration / 100))
        })
      }, 100)

      const timeout = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [duration, handleClose])

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={cn(
        'relative min-w-[300px] max-w-md rounded-xl border shadow-lg',
        'transform transition-all duration-200',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        styles.container
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={cn(
          'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold',
          styles.iconColor
        )}>
          {styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="font-medium text-gray-900">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
          aria-label="Fechar notificação"
        >
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-xl bg-black/5">
          <div
            className="h-full bg-current opacity-30 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (typeof window === 'undefined' || toasts.length === 0) return null

  return createPortal(
    <div 
      className={cn(
        'fixed z-[var(--z-toast)]',
        // Mobile: top center
        'top-4 left-4 right-4',
        // Desktop: top right
        'md:left-auto md:right-4 md:top-4'
      )}
    >
      <div className="flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </div>
    </div>,
    document.body
  )
}

// Hook for using toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return {
    toasts,
    addToast,
    removeToast
  }
}