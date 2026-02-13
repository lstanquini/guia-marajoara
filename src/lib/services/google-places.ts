import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_TTL_HOURS = Number(process.env.GOOGLE_PLACES_CACHE_TTL_HOURS || 24)

type SearchParams = {
  query: string
  neighborhood?: string | null
  city?: string | null
  state?: string | null
  address?: string | null
}

type PlaceSummary = {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
}

type PlaceDetails = {
  place_id?: string
  name?: string
  rating?: number
  user_ratings_total?: number
  reviews?: unknown[]
  formatted_address?: string
  geometry?: unknown
  formatted_phone_number?: string
  opening_hours?: unknown
  website?: string
  photos?: unknown[]
}

type CacheEntry = {
  cache_key: string
  payload: unknown
  expires_at: string
}

function getGoogleApiKey() {
  const key = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!key) {
    throw new Error('Google Maps API key not configured')
  }
  return key
}

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRole) return null

  return createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function normalize(value?: string | null) {
  return (value || '').replace(/\s+/g, ' ').trim()
}

function hashKey(input: string) {
  return createHash('sha256').update(input).digest('hex')
}

function cacheExpirationIso(hours = DEFAULT_TTL_HOURS) {
  const expires = new Date()
  expires.setHours(expires.getHours() + hours)
  return expires.toISOString()
}

async function getCache(cacheKey: string): Promise<CacheEntry | null> {
  const supabase = getAdminSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('google_places_cache')
    .select('cache_key,payload,expires_at')
    .eq('cache_key', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error || !data) return null
  return data as CacheEntry
}

async function setCache(params: {
  cacheKey: string
  cacheType: 'search' | 'details'
  payload: unknown
  queryText?: string | null
  placeId?: string | null
  ttlHours?: number
}) {
  const supabase = getAdminSupabase()
  if (!supabase) return

  await supabase
    .from('google_places_cache')
    .upsert(
      {
        cache_key: params.cacheKey,
        cache_type: params.cacheType,
        query_text: params.queryText || null,
        place_id: params.placeId || null,
        payload: params.payload,
        expires_at: cacheExpirationIso(params.ttlHours),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'cache_key' }
    )
}

function buildQueryVariants(search: SearchParams): string[] {
  const q = normalize(search.query)
  const n = normalize(search.neighborhood)
  const c = normalize(search.city)
  const s = normalize(search.state)
  const a = normalize(search.address)

  return [
    `${q}${n ? `, ${n}` : ''}${c ? `, ${c}` : ''}${s ? `, ${s}` : ''}`,
    `${q}${a ? `, ${a}` : ''}${c ? `, ${c}` : ''}${s ? `, ${s}` : ''}`,
    q,
  ]
    .map(normalize)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 3)
}

export async function searchGooglePlacesWithCache(search: SearchParams): Promise<PlaceSummary[]> {
  const queryVariants = buildQueryVariants(search)
  if (queryVariants.length === 0) return []

  const cacheKey = `search:${hashKey(queryVariants.join('|'))}`
  const cached = await getCache(cacheKey)
  if (cached?.payload && Array.isArray(cached.payload)) {
    return cached.payload as PlaceSummary[]
  }

  const apiKey = getGoogleApiKey()
  const allCandidates: PlaceSummary[] = []

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

      break
    }
  }

  const unique = Array.from(new Map(allCandidates.map(c => [c.place_id, c])).values()).slice(0, 5)

  if (unique.length > 0) {
    await setCache({
      cacheKey,
      cacheType: 'search',
      queryText: queryVariants.join(' | '),
      payload: unique,
    })
  }

  return unique
}

export async function getGooglePlaceDetailsWithCache(
  placeId: string,
  options?: { forceRefresh?: boolean; ttlHours?: number }
): Promise<PlaceDetails | null> {
  if (!placeId) return null

  const cacheKey = `details:${placeId}`

  if (!options?.forceRefresh) {
    const cached = await getCache(cacheKey)
    if (cached?.payload && typeof cached.payload === 'object') {
      return cached.payload as PlaceDetails
    }
  }

  const apiKey = getGoogleApiKey()
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,rating,user_ratings_total,reviews,formatted_address,geometry,formatted_phone_number,opening_hours,website,photos&key=${apiKey}&language=pt-BR`
  )

  const data = await response.json()
  if (data.status !== 'OK' || !data.result) {
    return null
  }

  await setCache({
    cacheKey,
    cacheType: 'details',
    placeId,
    payload: data.result,
    ttlHours: options?.ttlHours,
  })

  return data.result as PlaceDetails
}
