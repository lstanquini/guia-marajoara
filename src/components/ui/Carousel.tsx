'use client'

import { useState, useEffect, useCallback, Children, ReactNode, useRef } from 'react'
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
  
  // Touch/Swipe support
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
  }, [totalSlides])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides)
  }, [totalSlides])
  
  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(goToNext, autoplayDelay)
    return () => clearTimeout(timer)
  }, [currentIndex, isPlaying, goToNext, autoplayDelay])

  const handleInteractionStart = () => setIsPlaying(false)
  const handleInteractionEnd = () => setIsPlaying(autoplay)

  // Touch handlers para swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    handleInteractionStart()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeThreshold = 50 // mínimo de pixels para considerar um swipe
    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - próximo
        goToNext()
      } else {
        // Swipe right - anterior
        goToPrev()
      }
    }
    
    handleInteractionEnd()
  }

  return (
    <div
      className={cn(
        "relative",
        arrowsOutside ? "md:px-16" : ""
      )}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
    >
      <div className="overflow-hidden touch-pan-y">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Children.map(children, (child, index) => (
            <div 
              key={index} 
              className="w-full flex-shrink-0" 
              role="group" 
              aria-roledescription="slide" 
              aria-label={`${index + 1} de ${totalSlides}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Setas - escondidas no mobile quando arrowsOutside */}
      {showArrows && (
        <>
          <button
            onClick={goToPrev}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              "bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg",
              "text-gray-700 hover:text-pink-600 hover:bg-white transition-all",
              "focus:outline-none focus:ring-2 focus:ring-pink-500",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              arrowsOutside 
                ? "hidden md:block md:-left-16" 
                : "left-2 md:left-4"
            )}
            aria-label="Slide anterior"
            disabled={totalSlides <= 1}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
          
          <button
            onClick={goToNext}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              "bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg",
              "text-gray-700 hover:text-pink-600 hover:bg-white transition-all",
              "focus:outline-none focus:ring-2 focus:ring-pink-500",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              arrowsOutside 
                ? "hidden md:block md:-right-16" 
                : "right-2 md:right-4"
            )}
            aria-label="Próximo slide"
            disabled={totalSlides <= 1}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Indicadores de página (dots) - apenas mobile */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex 
                  ? "bg-pink-600 w-6" 
                  : "bg-gray-300"
              )}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}