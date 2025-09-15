-- =====================================================
-- GUIA MARAJOARA - SCHEMA COMPLETO COM LGPD COMPLIANCE
-- Versão: 2.0.0 FINAL
-- Data: 15/09/2025
-- 
-- ESTE É O ARQUIVO ÚNICO E DEFINITIVO
-- =====================================================

-- =====================================================
-- PARTE 1: EXTENSÕES NECESSÁRIAS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Para busca fuzzy
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Para remover acentos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Para criptografia LGPD

-- =====================================================
-- PARTE 2: TABELA DE CONSENTIMENTO (LGPD OBRIGATÓRIA)
-- =====================================================
CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_identifier_hash TEXT NOT NULL,                -- email ou telefone hasheado
  consent_type TEXT NOT NULL CHECK (
    consent_type IN ('terms', 'marketing', 'data_processing', 'cookies')
  ),
  consent_given BOOLEAN NOT NULL,
  consent_text TEXT NOT NULL,                        -- texto exato apresentado
  version TEXT NOT NULL,                             -- versão dos termos (ex: "1.0.0")
  ip_address INET,
  user_agent TEXT,
  given_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_consent_user ON consent_logs(user_identifier_hash);
CREATE INDEX idx_consent_type ON consent_logs(consent_type);
CREATE INDEX idx_consent_expires ON consent_logs(expires_at);

-- =====================================================
-- PARTE 3: TABELA DE CATEGORIAS
-- =====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  color VARCHAR(7),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias padrão do Jardim Marajoara
INSERT INTO categories (name, slug, icon, color, order_index) VALUES
('Restaurantes', 'restaurantes', '🍴', '#FF5722', 1),
('Beleza', 'beleza', '💅', '#E91E63', 2),
('Pet Shop', 'pet-shop', '🐾', '#9C27B0', 3),
('Saúde', 'saude', '🏥', '#2196F3', 4),
('Mercado', 'mercado', '🛒', '#00BCD4', 5),
('Fitness', 'fitness', '💪', '#4CAF50', 6),
('Vestuário', 'vestuario', '👕', '#FF9800', 7),
('Serviços', 'servicos', '🔧', '#795548', 8),
('Educação', 'educacao', '📚', '#607D8B', 9),
('Automotivo', 'automotivo', '🚗', '#9E9E9E', 10);

-- =====================================================
-- PARTE 4: TABELA DE EMPRESAS (COM LGPD)
-- =====================================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Dados básicos públicos
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  
  -- Contato público
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  instagram VARCHAR(100),
  facebook VARCHAR(100),
  
  -- Endereço
  address TEXT NOT NULL,
  address_number VARCHAR(20),
  address_complement VARCHAR(100),
  neighborhood VARCHAR(100) DEFAULT 'Jardim Marajoara',
  city VARCHAR(100) DEFAULT 'São Paulo',
  state CHAR(2) DEFAULT 'SP',
  zip_code VARCHAR(9),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Dados sensíveis (serão criptografados)
  cpf_cnpj_encrypted TEXT,                           -- CPF/CNPJ criptografado
  responsible_name_encrypted TEXT,                   -- Nome do responsável criptografado
  responsible_phone_encrypted TEXT,                  -- Telefone do responsável criptografado
  
  -- Autenticação
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token UUID,
  password_reset_token UUID,
  password_reset_expires TIMESTAMPTZ,
  
  -- Plano e Status
  plan_type VARCHAR(20) DEFAULT 'basic' CHECK (plan_type IN ('basic', 'premium')),
  plan_expires_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'suspended', 'cancelled')
  ),
  
  -- Features do plano
  max_coupons INTEGER DEFAULT 5,                     -- 5 para basic, 10 para premium
  max_photos INTEGER DEFAULT 5,
  has_analytics BOOLEAN DEFAULT false,
  has_priority_support BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  
  -- Métricas
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  
  -- LGPD Compliance
  terms_accepted BOOLEAN DEFAULT false,
  terms_version VARCHAR(10),
  consent_id UUID REFERENCES consent_logs(id),
  data_retention_days INTEGER DEFAULT 730,           -- 2 anos padrão
  deletion_requested_at TIMESTAMPTZ,
  deletion_scheduled_at TIMESTAMPTZ,
  anonymized BOOLEAN DEFAULT false,
  
  -- Controle
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ                             -- soft delete
);

-- Índices para performance
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_plan ON businesses(plan_type);
CREATE INDEX idx_businesses_neighborhood ON businesses(neighborhood);

-- =====================================================
-- PARTE 5: RELAÇÃO EMPRESAS x CATEGORIAS (N:N)
-- =====================================================
CREATE TABLE business_categories (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (business_id, category_id)
);

-- =====================================================
-- PARTE 6: HORÁRIOS DE FUNCIONAMENTO
-- =====================================================
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT false,
  UNIQUE(business_id, day_of_week)
);

-- =====================================================
-- PARTE 7: TABELA DE CUPONS
-- =====================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  
  code VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (
    discount_type IN ('percentage', 'fixed', 'freebie')
  ),
  discount_value DECIMAL(10, 2),
  min_purchase DECIMAL(10, 2),
  
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL,
  
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  limit_per_customer INTEGER DEFAULT 1,
  
  is_active BOOLEAN DEFAULT true,
  requires_auth BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(business_id, code)
);

CREATE INDEX idx_coupons_business ON coupons(business_id);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_valid ON coupons(valid_until);

-- =====================================================
-- PARTE 8: TABELA DE RESGATES DE CUPONS (COM LGPD)
-- =====================================================
CREATE TABLE coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Dados do cliente
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  
  -- LGPD Compliance (OBRIGATÓRIO)
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_id UUID REFERENCES consent_logs(id),
  terms_version VARCHAR(10) NOT NULL,
  marketing_consent BOOLEAN DEFAULT false,
  
  -- Controle
  redemption_code VARCHAR(10) UNIQUE NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  validated_at TIMESTAMPTZ,
  
  -- Anonimização automática
  anonymized BOOLEAN DEFAULT false,
  anonymized_at TIMESTAMPTZ,
  data_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 years')
);

CREATE INDEX idx_redemptions_coupon ON coupon_redemptions(coupon_id);
CREATE INDEX idx_redemptions_expires ON coupon_redemptions(data_expires_at);

-- =====================================================
-- PARTE 9: TABELA DE ANALYTICS
-- =====================================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  ip_address_hash TEXT,                              -- IP hasheado para privacidade
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_business ON analytics_events(business_id);
CREATE INDEX idx_analytics_date ON analytics_events(created_at);

-- =====================================================
-- PARTE 10: TABELA DE LISTA DE ESPERA
-- =====================================================
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  business_type VARCHAR(100),
  
  -- LGPD
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_id UUID REFERENCES consent_logs(id),
  marketing_consent BOOLEAN DEFAULT false,
  
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ
);

-- =====================================================
-- PARTE 11: TABELA DE MENSAGENS DE CONTATO
-- =====================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  
  -- LGPD
  consent_given BOOLEAN NOT NULL DEFAULT false,
  
  status VARCHAR(20) DEFAULT 'new',
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PARTE 12: FUNÇÕES AUXILIARES
-- =====================================================

-- Função para normalizar texto (busca fuzzy)
CREATE OR REPLACE FUNCTION normalize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(unaccent(input_text));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função de busca inteligente
CREATE OR REPLACE FUNCTION smart_search(
  search_query TEXT,
  search_category UUID DEFAULT NULL,
  limit_results INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  description TEXT,
  similarity_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.slug,
    b.description,
    similarity(normalize_text(b.name), normalize_text(search_query)) as similarity_score
  FROM businesses b
  LEFT JOIN business_categories bc ON b.id = bc.business_id
  WHERE 
    b.deleted_at IS NULL
    AND b.status = 'approved'
    AND b.is_active = true
    AND (search_category IS NULL OR bc.category_id = search_category)
    AND normalize_text(b.name) % normalize_text(search_query)
  ORDER BY similarity_score DESC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Função para hashear identificadores (LGPD)
CREATE OR REPLACE FUNCTION hash_identifier(identifier TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(identifier, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Função para anonimizar dados antigos (LGPD)
CREATE OR REPLACE FUNCTION anonymize_old_data()
RETURNS void AS $$
BEGIN
  -- Anonimizar resgates após 2 anos
  UPDATE coupon_redemptions
  SET
    customer_name = 'ANONIMIZADO',
    customer_phone = 'ANONIMIZADO',
    customer_email = 'ANONIMIZADO',
    anonymized = true,
    anonymized_at = NOW()
  WHERE data_expires_at < NOW()
    AND anonymized = false;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PARTE 13: TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_businesses_updated_at 
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_coupons_updated_at 
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_consent_logs_updated_at 
  BEFORE UPDATE ON consent_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- PARTE 14: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
CREATE POLICY "Categories are viewable by everyone" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Active businesses are viewable by everyone" 
  ON businesses FOR SELECT 
  USING (status = 'approved' AND deleted_at IS NULL);

CREATE POLICY "Active coupons are viewable by everyone" 
  ON coupons FOR SELECT 
  USING (is_active = true AND valid_until > NOW());

CREATE POLICY "Business hours are viewable by everyone" 
  ON business_hours FOR SELECT 
  USING (true);

CREATE POLICY "Business categories are viewable by everyone" 
  ON business_categories FOR SELECT 
  USING (true);

-- Políticas de escrita (apenas com consentimento)
CREATE POLICY "Anyone can redeem coupons with consent" 
  ON coupon_redemptions FOR INSERT 
  WITH CHECK (consent_given = true);

CREATE POLICY "Anyone can join waitlist with consent" 
  ON waitlist FOR INSERT 
  WITH CHECK (consent_given = true);

CREATE POLICY "Anyone can send contact message with consent" 
  ON contact_messages FOR INSERT 
  WITH CHECK (consent_given = true);

CREATE POLICY "Anyone can log consent" 
  ON consent_logs FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can log analytics" 
  ON analytics_events FOR INSERT 
  WITH CHECK (true);

-- =====================================================
-- FIM DO SCHEMA - GUIA MARAJOARA v2.0.0
-- =====================================================