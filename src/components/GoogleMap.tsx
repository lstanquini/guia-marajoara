'use client'

import { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'

interface GoogleMapComponentProps {
  address: string
  businessName: string
  lat?: number
  lng?: number
}

// Mapa maior e responsivo
const mapContainerStyle = {
  width: '100%',
  height: '500px', // Aumentado de 400px para 500px
  borderRadius: '0'
}

const defaultCenter = {
  lat: -23.6274, // Jardim Marajoara, São Paulo
  lng: -46.7078
}

export function GoogleMapComponent({ address, businessName, lat, lng }: GoogleMapComponentProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    // Se já temos lat/lng, usar diretamente
    if (lat && lng) {
      setCoordinates({ lat, lng })
      setLoading(false)
      return
    }

    // Caso contrário, fazer geocoding do endereço
    if (!apiKey || !address) {
      setLoading(false)
      return
    }

    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        )
        const data = await response.json()

        if (data.status === 'OK' && data.results[0]) {
          const location = data.results[0].geometry.location
          setCoordinates({ lat: location.lat, lng: location.lng })
        } else {
          setError('Não foi possível localizar o endereço')
        }
      } catch (err) {
        console.error('Erro ao buscar coordenadas:', err)
        setError('Erro ao carregar mapa')
      } finally {
        setLoading(false)
      }
    }

    geocodeAddress()
  }, [address, lat, lng, apiKey])

  // Se não tiver API key configurada
  if (!apiKey) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">{address}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C2227A] hover:underline"
        >
          Ver no Google Maps
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-xl animate-pulse" style={{ height: '400px' }} />
    )
  }

  if (error || !coordinates) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">{address}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C2227A] hover:underline"
        >
          Ver no Google Maps
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coordinates}
          zoom={16}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          <Marker
            position={coordinates}
            title={businessName}
          />
        </GoogleMap>
      </LoadScript>

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
