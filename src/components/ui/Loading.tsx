'use client'

import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  }

  return (
    <div 
      role="status" 
      aria-live="polite"
      className={cn('flex items-center justify-center', className)}
    >
      <span className="sr-only">Carregando...</span>
      <svg
        className={cn(
          'animate-spin text-[#C2227A]',
          sizeClasses[size]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'title' | 'card' | 'image'
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    card: 'h-32 w-full rounded-2xl',
    image: 'h-40 w-full rounded-xl'
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Conteúdo carregando"
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        variantClasses[variant],
        className
      )}
    />
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div 
      className={cn('rounded-2xl bg-white p-6 shadow-sm', className)}
      role="status"
      aria-busy="true"
      aria-label="Card carregando"
    >
      <Skeleton variant="image" className="mb-4" />
      <Skeleton variant="title" className="mb-2" />
      <Skeleton variant="text" className="mb-1" />
      <Skeleton variant="text" className="w-5/6" />
    </div>
  )
}

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = 'Carregando página...' }: LoadingPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="mb-4" />
        <p className="text-[#6B7280]">{message}</p>
      </div>
    </div>
  )
}