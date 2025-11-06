'use client'

import { GoogleMapComponent } from './GoogleMap'
import { GoogleReviews } from './GoogleReviews'
import { useGooglePlace } from '@/hooks/useGooglePlace'
import { MapPin } from 'lucide-react'

interface BusinessMapAndReviewsProps {
  businessName: string
  address: string
  lat?: number | null
  lng?: number | null
  googlePlaceId?: string | null
}

export function BusinessMapAndReviews({
  businessName,
  address,
  lat,
  lng,
  googlePlaceId
}: BusinessMapAndReviewsProps) {
  // Buscar dados do Google Places se tivermos placeId ou nome+endereço
  const { data: placeData, loading, error } = useGooglePlace({
    placeId: googlePlaceId || undefined,
    query: !googlePlaceId ? `${businessName}, ${address}` : undefined,
    enabled: true
  })

  // Usar coordenadas do Google Places se disponíveis, senão usar as do banco
  const finalLat = placeData?.geometry?.location.lat || (lat ?? undefined)
  const finalLng = placeData?.geometry?.location.lng || (lng ?? undefined)

  return (
    <div className="space-y-8">
      {/* Mapa - Maior e mais proeminente */}
      <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Localização e Avaliações</h2>
          <div className="flex items-start gap-2 text-slate-600 mb-4">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#C2227A]" />
            <p className="font-medium">{address}</p>
          </div>
        </div>

        {/* Mapa responsivo */}
        <div className="w-full">
          <GoogleMapComponent
            address={address}
            businessName={businessName}
            lat={finalLat}
            lng={finalLng}
          />
        </div>
      </section>

      {/* Avaliações do Google */}
      {!loading && placeData?.reviews && placeData.reviews.length > 0 && (
        <GoogleReviews
          reviews={placeData.reviews}
          rating={placeData.rating}
          totalReviews={placeData.user_ratings_total}
        />
      )}

      {/* Mensagem de carregamento */}
      {loading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de erro (silenciosa - não mostrar erro visualmente) */}
      {error && !loading && (
        <div className="text-sm text-gray-500 text-center">
          {/* Silenciosamente falhou ao buscar avaliações do Google */}
        </div>
      )}
    </div>
  )
}
