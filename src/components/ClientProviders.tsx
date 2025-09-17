'use client'

import { ToastContainer, useToast } from '@/components/ui/Toast'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast()
  
  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}