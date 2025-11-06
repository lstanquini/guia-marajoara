-- Adicionar campo google_place_id na tabela businesses
-- Este campo armazena o Place ID do Google para buscar avaliações e detalhes

ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS google_place_id TEXT;

-- Adicionar comentário ao campo
COMMENT ON COLUMN businesses.google_place_id IS 'Google Place ID para buscar avaliações e detalhes do Google Maps';

-- Criar índice para consultas rápidas (opcional, mas recomendado)
CREATE INDEX IF NOT EXISTS idx_businesses_google_place_id ON businesses(google_place_id);
