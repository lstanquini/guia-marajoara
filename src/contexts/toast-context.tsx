'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ToastContainer, ToastProps } from '@/components/ui/Toast'

type ToastContextType = {
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (title: string, description?: string, variant: ToastProps['variant'] = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, title, description, variant }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const value = {
    success: (title: string, desc?: string) => addToast(title, desc, 'success'),
    error: (title: string, desc?: string) => addToast(title, desc, 'error'),
    warning: (title: string, desc?: string) => addToast(title, desc, 'warning'),
    info: (title: string, desc?: string) => addToast(title, desc, 'info')
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}