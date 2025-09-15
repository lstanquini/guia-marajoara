'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  actions?: ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  actions
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      modalRef.current?.focus()
      
      // Trap focus
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleTabKey)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleTabKey)
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
        previousActiveElement.current?.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 'var(--z-modal-backdrop)' }}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        style={{ zIndex: 'var(--z-modal)' }}
        className={cn(
          'fixed',
          // Mobile: fullscreen
          'inset-0 bg-white',
          // Desktop: centered
          'md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
          'md:w-full md:max-w-xl md:rounded-2xl md:shadow-xl',
          'flex flex-col',
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b p-4 md:p-6">
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-[#1A1A1A]">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                aria-label="Fechar modal"
              >
                <svg
                  className="h-5 w-5"
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
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p id="modal-description" className="px-4 pt-4 text-sm text-[#6B7280] md:px-6">
            {description}
          </p>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>

        {/* Footer/Actions */}
        {actions && (
          <div className="border-t p-4 md:p-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {actions}
            </div>
          </div>
        )}
      </div>
    </>
  )

  // Render modal in portal
  if (typeof window !== 'undefined') {
    return createPortal(
      modalContent,
      document.body
    )
  }

  return null
}

