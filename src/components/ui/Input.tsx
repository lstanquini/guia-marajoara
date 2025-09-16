import { forwardRef, InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex h-11 w-full rounded-lg border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white focus-visible:ring-verde',
        inverted: 'border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white', // <-- ADICIONADO
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  label?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, label, name, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={name} className={cn("text-sm font-medium", variant === 'inverted' && 'sr-only')}>
            {label}
          </label>
        )}
        <input
          type={type}
          name={name}
          id={name}
          className={cn(inputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }