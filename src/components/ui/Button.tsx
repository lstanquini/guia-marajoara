'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-rosa text-white hover:bg-rosa/90 focus-visible:ring-rosa',
        secondary: 'bg-verde text-white hover:bg-verde/90 focus-visible:ring-verde',
        outline: 'border-2 border-rosa bg-transparent text-rosa hover:bg-rosa hover:text-white',
        ghost: 'bg-transparent text-text-primary hover:bg-gray-100',
        whatsapp: 'bg-[#25D366] text-white hover:bg-[#20BD5C] hover:scale-105 focus-visible:ring-[#25D366]',
        inverted: 'bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white', // <-- ADICIONADO
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
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? ( <div>Carregando...</div> ) : ( children )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }