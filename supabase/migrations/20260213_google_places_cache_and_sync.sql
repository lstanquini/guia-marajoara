-- Cache de consultas/details do Google Places para reduzir custo de API
CREATE TABLE IF NOT EXISTS google_places_cache (
  cache_key TEXT PRIMARY KEY,
  cache_type TEXT NOT NULL CHECK (cache_type IN ('search', 'details')),
  query_text TEXT,
  place_id TEXT,
  payload JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_google_places_cache_expires_at ON google_places_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_google_places_cache_place_id ON google_places_cache(place_id);

-- Campos de controle de sincronizacao automatica de rating
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS google_ratings_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS google_ratings_last_error TEXT;

CREATE INDEX IF NOT EXISTS idx_businesses_google_ratings_synced_at
  ON businesses(google_ratings_synced_at);
