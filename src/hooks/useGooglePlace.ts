'use client'

import { useState, useEffect } from 'react'

export interface GooglePlaceReview {
  author_name: string
  author_url?: string
  language: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

export interface GooglePlaceData {
  name: string
  rating?: number
  user_ratings_total?: number
  reviews?: GooglePlaceReview[]
  formatted_address?: string
  formatted_phone_number?: string
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  opening_hours?: {
    open_now?: boolean
    weekday_text?: string[]
  }
  website?: string
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
}

interface UseGooglePlaceOptions {
  placeId?: string
  query?: string
  enabled?: boolean
}

export function useGooglePlace({ placeId, query, enabled = true }: UseGooglePlaceOptions) {
  const [data, setData] = useState<GooglePlaceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || (!placeId && !query)) {
      return
    }

    const fetchPlaceData = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (placeId) params.append('placeId', placeId)
        if (query) params.append('query', query)

        const response = await fetch(`/api/google-places?${params.toString()}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erro ao buscar dados do local')
        }

        const placeData = await response.json()
        setData(placeData)
      } catch (err) {
        console.error('Erro ao buscar lugar:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchPlaceData()
  }, [placeId, query, enabled])

  return { data, loading, error }
}
