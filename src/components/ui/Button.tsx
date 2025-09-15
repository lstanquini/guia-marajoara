'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-[#C2227A] text-white hover:bg-[#A01860] focus-visible:ring-[#C2227A]',
        secondary: 'bg-[#7CB342] text-white hover:bg-[#6A9A38] focus-visible:ring-[#7CB342]',
        outline: 'border-2 border-[#C2227A] bg-transparent text-[#C2227A] hover:bg-[#C2227A] hover:text-white',
        ghost: 'bg-transparent text-[#1A1A1A] hover:bg-gray-100',
        whatsapp: 'bg-[#25D366] text-white hover:bg-[#20BD5C] hover:scale-105 focus-visible:ring-[#25D366]'
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-base',
        lg: 'h-12 px-6 text-base min-w-[120px]',
        full: 'h-12 w-full px-6 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg'
    }
  }
)

export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg 
              className="mr-2 h-4 w-4 animate-spin" 
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
            Carregando...
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="mr-2">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="ml-2">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }