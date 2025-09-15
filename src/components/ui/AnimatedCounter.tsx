'use client'

import { useEffect, useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  className?: string
  duration?: number
}

// Easing function for a smoother animation
function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5)
}

export function AnimatedCounter({ value, className, duration = 1500 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTimestamp: number | null = null
          const end = value

          const animate = (timestamp: number) => {
            if (!startTimestamp) {
              startTimestamp = timestamp
            }
            
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            const easedProgress = easeOutQuint(progress)
            const currentValue = Math.floor(easedProgress * end)
            
            if (ref.current) {
              ref.current.textContent = currentValue.toLocaleString('pt-BR')
            }

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}