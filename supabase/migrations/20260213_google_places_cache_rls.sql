-- Segurança: habilitar RLS na tabela de cache do Google Places
ALTER TABLE IF EXISTS google_places_cache ENABLE ROW LEVEL SECURITY;

-- Garante que clientes anon/authenticated não tenham acesso direto
DROP POLICY IF EXISTS "google_places_cache_select_authenticated" ON google_places_cache;
DROP POLICY IF EXISTS "google_places_cache_insert_authenticated" ON google_places_cache;
DROP POLICY IF EXISTS "google_places_cache_update_authenticated" ON google_places_cache;
DROP POLICY IF EXISTS "google_places_cache_delete_authenticated" ON google_places_cache;

-- Sem policies de acesso para anon/authenticated.
-- O backend usa service_role (bypass RLS), mantendo a tabela privada.

REVOKE ALL ON TABLE google_places_cache FROM anon, authenticated;
