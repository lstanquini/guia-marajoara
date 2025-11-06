import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const placeId = searchParams.get('placeId')
  const query = searchParams.get('query')

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key not configured' },
      { status: 500 }
    )
  }

  try {
    // Se temos placeId, buscar detalhes do lugar
    if (placeId) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,formatted_address,geometry,formatted_phone_number,opening_hours,website,photos&key=${apiKey}&language=pt-BR`
      )
      const data = await response.json()

      if (data.status === 'OK') {
        return NextResponse.json(data.result)
      } else {
        return NextResponse.json(
          { error: data.status, message: data.error_message },
          { status: 404 }
        )
      }
    }

    // Se temos query, buscar pelo nome/endereço
    if (query) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address,geometry&key=${apiKey}&language=pt-BR`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
        // Pegar o primeiro resultado e buscar detalhes
        const placeId = data.candidates[0].place_id

        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,formatted_address,geometry,formatted_phone_number,opening_hours,website,photos&key=${apiKey}&language=pt-BR`
        )
        const detailsData = await detailsResponse.json()

        if (detailsData.status === 'OK') {
          return NextResponse.json(detailsData.result)
        }
      }

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
