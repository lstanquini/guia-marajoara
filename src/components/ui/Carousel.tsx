'use client'

import { useState, useEffect, useCallback, Children, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
  children: ReactNode[]
  autoplay?: boolean
  autoplayDelay?: number
  showArrows?: boolean
  arrowsOutside?: boolean
}

export function Carousel({ 
  children, 
  autoplay = true, 
  autoplayDelay = 5000,
  showArrows = true,
  arrowsOutside = false
}: CarouselProps) {
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
      className={cn("relative", arrowsOutside && "px-12 md:px-16")}
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

      {/* Navigation Arrows - Versão Limpa */}
      {showArrows && (
        <>
          <button
            onClick={goToPrev}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              "text-gray-700 hover:text-pink-600 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              arrowsOutside ? "-left-12 md:-left-16" : "left-2 md:left-4"
            )}
            aria-label="Slide anterior"
            disabled={totalSlides <= 1}
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 drop-shadow-lg" strokeWidth={2.5} />
          </button>
          
          <button
            onClick={goToNext}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              "text-gray-700 hover:text-pink-600 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              arrowsOutside ? "-right-12 md:-right-16" : "right-2 md:right-4"
            )}
            aria-label="Próximo slide"
            disabled={totalSlides <= 1}
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10 drop-shadow-lg" strokeWidth={2.5} />
          </button>
        </>
      )}

    </div>
  )
}