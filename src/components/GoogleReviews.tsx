'use client'

import { Star } from 'lucide-react'
import { GooglePlaceReview } from '@/hooks/useGooglePlace'

interface GoogleReviewsProps {
  reviews: GooglePlaceReview[]
  rating?: number
  totalReviews?: number
}

export function GoogleReviews({ reviews, rating, totalReviews }: GoogleReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
            Avaliações do Google
          </h3>
          {rating && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-[#1A1A1A]">{rating.toFixed(1)}</span>
                <Star size={24} fill="#FBBF24" className="text-yellow-400" />
              </div>
              {totalReviews && (
                <span className="text-gray-500">
                  ({totalReviews.toLocaleString('pt-BR')} avaliações)
                </span>
              )}
            </div>
          )}
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reviews[0]?.author_name || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#C2227A] hover:underline font-medium"
        >
          Ver todas no Google →
        </a>
      </div>

      <div className="space-y-4">
        {reviews.slice(0, 5).map((review, index) => (
          <div
            key={index}
            className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
          >
            <div className="flex items-start gap-3 mb-2">
              {review.profile_photo_url ? (
                <img
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C2227A] to-[#A01860] flex items-center justify-center text-white font-semibold">
                  {review.author_name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">
                      {review.author_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {review.relative_time_description}
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? '#FBBF24' : 'none'}
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                </div>

                {review.text && (
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {review.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
        <img
          src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
          alt="Google"
          className="h-4"
        />
        <span>Avaliações verificadas pelo Google</span>
      </div>
    </div>
  )
}
