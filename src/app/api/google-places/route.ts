import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const placeId = searchParams.get('placeId')
  const query = searchParams.get('query')
  const neighborhood = searchParams.get('neighborhood')
  const city = searchParams.get('city')
  const state = searchParams.get('state')
  const address = searchParams.get('address')

  // Use server key first for Places Web Service calls.
  // Keep NEXT_PUBLIC fallback to avoid immediate breakage in older environments.
  const apiKey =
    process.env.GOOGLE_MAPS_SERVER_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key not configured (server key preferred)' },
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

    // Se temos query, buscar candidatos com contexto (mais inteligente e econômico).
    // Só chamamos place details depois que o usuário escolhe um resultado para vincular.
    if (query) {
      const clean = (value: string | null) => (value || '').trim()
      const q = clean(query)
      const n = clean(neighborhood)
      const c = clean(city)
      const s = clean(state)
      const a = clean(address)

      const queryVariants = [
        `${q}${n ? `, ${n}` : ''}${c ? `, ${c}` : ''}${s ? `, ${s}` : ''}`,
        `${q}${a ? `, ${a}` : ''}${c ? `, ${c}` : ''}${s ? `, ${s}` : ''}`,
        q,
      ]
        .map(v => v.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .slice(0, 3)

      const allCandidates: Array<{
        place_id: string
        name: string
        formatted_address: string
        rating?: number
        user_ratings_total?: number
      }> = []

      for (const variant of queryVariants) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(variant)}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total&locationbias=circle:4000@-23.6274,-46.7078&key=${apiKey}&language=pt-BR`
        )
        const data = await response.json()

        if (data.status === 'OK' && Array.isArray(data.candidates) && data.candidates.length > 0) {
          for (const candidate of data.candidates) {
            if (!candidate?.place_id) continue

            allCandidates.push({
              place_id: candidate.place_id,
              name: candidate.name || 'Sem nome',
              formatted_address: candidate.formatted_address || '',
              rating: candidate.rating,
              user_ratings_total: candidate.user_ratings_total,
            })
          }

          // Encontrou resultados nesta variante: para reduzir custo/latência, não tenta as próximas.
          break
        }
      }

      if (allCandidates.length > 0) {
        const unique = Array.from(
          new Map(allCandidates.map(c => [c.place_id, c])).values()
        ).slice(0, 5)

        return NextResponse.json(unique)
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
