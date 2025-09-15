'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  className?: string
  duration?: number
}

export function AnimatedCounter({ value, className, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const end = value
          if (start === end) return

          const incrementTime = (duration / end)
          const timer = setInterval(() => {
            start += 1
            setCount(start)
            if (start === end) clearInterval(timer)
          }, incrementTime)
          
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
      {count.toLocaleString('pt-BR')}
    </span>
  )
}