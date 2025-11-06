'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

interface GoogleMapSimpleProps {
  address: string
  businessName: string
  lat?: number
  lng?: number
}

declare global {
  interface Window {
    google: any
    initMap?: () => void
  }
}

export function GoogleMapSimple({ address, businessName, lat, lng }: GoogleMapSimpleProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Carregar script do Google Maps
  useEffect(() => {
    console.log('[GoogleMapSimple] Iniciando carregamento do mapa')
    console.log('[GoogleMapSimple] API Key presente:', !!apiKey)

    if (!apiKey) {
      console.log('[GoogleMapSimple] API Key não encontrada')
      setLoading(false)
      return
    }

    // Verificar se já está carregado
    if (window.google && window.google.maps) {
      console.log('[GoogleMapSimple] Google Maps já carregado')
      setScriptLoaded(true)
      return
    }

    // Carregar script
    console.log('[GoogleMapSimple] Criando script do Google Maps')
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('[GoogleMapSimple] Script carregado com sucesso')
      setScriptLoaded(true)
    }
    script.onerror = (error) => {
      console.error('[GoogleMapSimple] Erro ao carregar script:', error)
      setError('Erro ao carregar Google Maps')
      setLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      // Não remover o script pois pode ser usado por outros componentes
    }
  }, [apiKey])

  // Obter coordenadas
  useEffect(() => {
    console.log('[GoogleMapSimple] UseEffect coordenadas - scriptLoaded:', scriptLoaded)

    if (!scriptLoaded) {
      console.log('[GoogleMapSimple] Script ainda não carregado, aguardando...')
      return
    }

    // Se já temos lat/lng, usar diretamente
    if (lat && lng) {
      console.log('[GoogleMapSimple] Usando coordenadas diretas:', { lat, lng })
      setCoordinates({ lat, lng })
      setLoading(false)
      return
    }

    // Fazer geocoding do endereço
    if (!address) {
      console.log('[GoogleMapSimple] Sem endereço para geocoding')
      setLoading(false)
      return
    }

    console.log('[GoogleMapSimple] Iniciando geocoding para:', address)
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address }, (results: any, status: string) => {
      console.log('[GoogleMapSimple] Resultado do geocoding:', status)

      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location
        const coords = {
          lat: location.lat(),
          lng: location.lng()
        }
        console.log('[GoogleMapSimple] Coordenadas encontradas:', coords)
        setCoordinates(coords)
      } else {
        console.error('[GoogleMapSimple] Erro no geocoding:', status)
        setError('Não foi possível localizar o endereço')
      }
      setLoading(false)
    })
  }, [scriptLoaded, address, lat, lng])

  // Renderizar mapa
  useEffect(() => {
    console.log('[GoogleMapSimple] UseEffect renderizar mapa:', {
      scriptLoaded,
      coordinates,
      mapRefCurrent: !!mapRef.current
    })

    if (!scriptLoaded || !coordinates || !mapRef.current) {
      console.log('[GoogleMapSimple] Aguardando: script, coordenadas ou ref do mapa')
      return
    }

    console.log('[GoogleMapSimple] Criando mapa com coordenadas:', coordinates)

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 16,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: false,
        fullscreenControl: true,
      })

      console.log('[GoogleMapSimple] Mapa criado com sucesso')

      new window.google.maps.Marker({
        position: coordinates,
        map: map,
        title: businessName,
      })

      console.log('[GoogleMapSimple] Marcador adicionado')
    } catch (error) {
      console.error('[GoogleMapSimple] Erro ao criar mapa:', error)
      setError('Erro ao renderizar mapa')
    }
  }, [scriptLoaded, coordinates, businessName])

  // Se não tiver API key configurada
  if (!apiKey) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2 text-sm">{address}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C2227A] hover:underline text-sm font-medium"
        >
          Ver no Google Maps →
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center" style={{ height: '500px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C2227A] mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  if (error || !coordinates) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2 text-sm">{address}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C2227A] hover:underline text-sm font-medium"
        >
          Ver no Google Maps →
        </a>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <div
        ref={mapRef}
        style={{ width: '100%', height: '500px' }}
        className="bg-gray-200"
      />

      <div className="bg-white p-4 border-t">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#C2227A]" />
          <div>
            <p className="font-medium text-gray-900 mb-1">{businessName}</p>
            <p>{address}</p>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-[#C2227A] hover:underline text-sm font-medium"
        >
          Abrir no Google Maps →
        </a>
      </div>
    </div>
  )
}
