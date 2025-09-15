'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'business' | 'coupon' | 'feature'
  hoverable?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = true, children, ...props }, ref) => {
    return (
      <article
        ref={ref}
        className={cn(
          'rounded-2xl bg-white p-4 shadow-sm',
          'transition-all duration-200',
          hoverable && 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer',
          variant === 'business' && 'p-6',
          variant === 'coupon' && 'border-2 border-dashed border-[#7CB342] bg-green-50/30',
          variant === 'feature' && 'text-center p-8',
          className
        )}
        role="article"
        {...props}
      >
        {children}
      </article>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-[#1A1A1A]',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
)

CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[#6B7280]', className)}
      {...props}
    />
  )
)

CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-4', className)} {...props} />
  )
)

CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  )
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }