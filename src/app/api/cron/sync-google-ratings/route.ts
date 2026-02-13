import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGooglePlaceDetailsWithCache } from '@/lib/services/google-places'

export const runtime = 'nodejs'

const DEFAULT_BATCH_SIZE = Number(process.env.GOOGLE_RATINGS_SYNC_BATCH_SIZE || 40)

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRole) {
    throw new Error('Supabase admin credentials not configured')
  }

  return createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const auth = request.headers.get('authorization') || ''
  return auth === `Bearer ${secret}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, google_place_id, rating, total_reviews, google_ratings_synced_at')
    .eq('status', 'approved')
    .not('google_place_id', 'is', null)
    .neq('google_place_id', 'not_on_google')
    .order('google_ratings_synced_at', { ascending: true, nullsFirst: true })
    .limit(DEFAULT_BATCH_SIZE)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let processed = 0
  let updated = 0
  let failed = 0

  for (const business of businesses || []) {
    processed += 1

    try {
      const details = await getGooglePlaceDetailsWithCache(business.google_place_id)

      if (!details) {
        failed += 1
        await supabase
          .from('businesses')
          .update({
            google_ratings_last_error: 'Place details not found',
          })
          .eq('id', business.id)
        continue
      }

      const rating = typeof details.rating === 'number' ? details.rating : null
      const totalReviews = typeof details.user_ratings_total === 'number' ? details.user_ratings_total : null

      const hasChanged = rating !== business.rating || totalReviews !== business.total_reviews

      await supabase
        .from('businesses')
        .update({
          rating,
          total_reviews: totalReviews,
          google_ratings_synced_at: new Date().toISOString(),
          google_ratings_last_error: null,
        })
        .eq('id', business.id)

      if (hasChanged) updated += 1
    } catch (syncError) {
      failed += 1
      await supabase
        .from('businesses')
        .update({
          google_ratings_last_error:
            syncError instanceof Error ? syncError.message.slice(0, 500) : 'Unknown sync error',
        })
        .eq('id', business.id)
    }
  }

  return NextResponse.json({
    ok: true,
    processed,
    updated,
    failed,
    batchSize: DEFAULT_BATCH_SIZE,
    timestamp: new Date().toISOString(),
  })
}
