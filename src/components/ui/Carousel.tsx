'use client'

import { useState, useEffect, useCallback, Children, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface CarouselProps {
  children: ReactNode[]
  autoplay?: boolean
  autoplayDelay?: number
}

export function Carousel({ children, autoplay = true, autoplayDelay = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const totalSlides = Children.count(children)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
  }, [totalSlides])

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides)
  }
  
  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(goToNext, autoplayDelay)
    return () => clearTimeout(timer)
  }, [currentIndex, isPlaying, goToNext, autoplayDelay])

  const handleInteractionStart = () => setIsPlaying(false)
  const handleInteractionEnd = () => setIsPlaying(true)

  return (
    <div
      className="relative"
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onFocus={handleInteractionStart}
      onBlur={handleInteractionEnd}
      role="region"
      aria-roledescription="carousel"
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Children.map(children, (child, index) => (
            <div key={index} className="w-full flex-shrink-0" role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${totalSlides}`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button variant="ghost" size="sm" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/80 hover:bg-white" onClick={goToPrev} aria-label="Slide anterior">
        {'<'}
      </Button>
      <Button variant="ghost" size="sm" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-white/80 hover:bg-white" onClick={goToNext} aria-label="Próximo slide">
        {'>'}
      </Button>

      {/* Dots and Play/Pause */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full bg-black/20 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pausar carrossel" : "Iniciar carrossel"}>
          {isPlaying ? '❚❚' : '▶'}
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)} className={cn('h-2 w-2 rounded-full bg-white transition-all', currentIndex === index ? 'opacity-100 w-4' : 'opacity-50 hover:opacity-75')} aria-label={`Ir para o slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  )
}