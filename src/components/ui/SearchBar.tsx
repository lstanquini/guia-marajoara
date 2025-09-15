'use client'

import { useState, useEffect, InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const placeholders = [
  'O que você procura?',
  'Buscar restaurantes...',
  'Encontrar pet shops...',
  'Procurar salões de beleza...',
  'Buscar farmácias...',
  'Encontrar academias...'
]

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void
  showClearButton?: boolean
  rotatePlaceholder?: boolean
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ 
    className, 
    onSearch, 
    showClearButton = true,
    rotatePlaceholder = true,
    placeholder: customPlaceholder,
    value: controlledValue,
    onChange,
    ...props 
  }, ref) => {
    const [value, setValue] = useState('')
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const isControlled = controlledValue !== undefined

    // Rotate placeholders
    useEffect(() => {
      if (!rotatePlaceholder || customPlaceholder) return

      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
      }, 3000)

      return () => clearInterval(interval)
    }, [rotatePlaceholder, customPlaceholder])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (!isControlled) {
        setValue(newValue)
      }
      onChange?.(e)
    }

    const handleClear = () => {
      if (!isControlled) {
        setValue('')
      }
      // Create synthetic event for controlled components
      const event = {
        target: { value: '' },
        currentTarget: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(event)
      onSearch?.('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const currentValue = isControlled ? String(controlledValue) : value
        onSearch?.(currentValue)
      }
    }

    const currentValue = isControlled ? String(controlledValue) : value
    const currentPlaceholder = customPlaceholder || placeholders[placeholderIndex]

    return (
      <div className={cn('relative w-full', className)}>
        <label htmlFor="search" className="sr-only">
          Buscar no site
        </label>
        
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 text-[#6B7280]"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input - Changed from type="search" to type="text" to avoid browser default X */}
        <input
          ref={ref}
          id="search"
          type="text"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={currentPlaceholder}
          className={cn(
            'h-12 w-full rounded-xl border border-gray-200 bg-white/90 pl-12',
            showClearButton && currentValue ? 'pr-12' : 'pr-4',
            'text-base text-[#1A1A1A] placeholder-[#6B7280]',
            'transition-all duration-200',
            'hover:border-gray-300',
            'focus:border-[#7CB342] focus:outline-none focus:ring-2 focus:ring-[#7CB342]/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Hide browser default search cancel button
            '[&::-webkit-search-cancel-button]:hidden',
            '[&::-webkit-search-decoration]:hidden',
            '[&::-webkit-search-results-button]:hidden',
            '[&::-webkit-search-results-decoration]:hidden'
          )}
          aria-label="Campo de busca"
          aria-describedby="search-hint"
          role="searchbox"
          autoComplete="off"
          {...props}
        />

        {/* Clear Button - Only show our custom one */}
        {showClearButton && currentValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-gray-100 transition-colors"
            aria-label="Limpar busca"
          >
            <svg
              className="h-4 w-4 text-[#6B7280]"
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

        {/* Screen reader hint */}
        <span id="search-hint" className="sr-only">
          Digite e pressione Enter para buscar
        </span>
      </div>
    )
  }
)

SearchBar.displayName = 'SearchBar'

export { SearchBar }