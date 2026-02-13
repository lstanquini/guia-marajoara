import { NextRequest, NextResponse } from 'next/server'
import {
  getGooglePlaceDetailsWithCache,
  searchGooglePlacesWithCache,
} from '@/lib/services/google-places'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const placeId = searchParams.get('placeId')
  const query = searchParams.get('query')
  const neighborhood = searchParams.get('neighborhood')
  const city = searchParams.get('city')
  const state = searchParams.get('state')
  const address = searchParams.get('address')

  try {
    // Se temos placeId, buscar detalhes do lugar
    if (placeId) {
      const details = await getGooglePlaceDetailsWithCache(placeId)

      if (details) return NextResponse.json(details)

      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Lugar não encontrado' },
        { status: 404 }
      )
    }

    // Se temos query, buscar candidatos com contexto e cache.
    if (query) {
      const candidates = await searchGooglePlacesWithCache({
        query,
        neighborhood,
        city,
        state,
        address,
      })

      if (candidates.length > 0) return NextResponse.json(candidates)

      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Lugar não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'placeId ou query é obrigatório' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro ao buscar dados do Google Places:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Erro ao buscar dados' },
      { status: 500 }
    )
  }
}
