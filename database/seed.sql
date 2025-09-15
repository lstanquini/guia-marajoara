-- =====================================================
-- GUIA MARAJOARA - SEED DATA (DADOS DE TESTE)
-- Versão: 1.0.0
-- Data: 15/09/2025
-- 
-- Dados fictícios para desenvolvimento e testes
-- =====================================================

-- =====================================================
-- 1. LIMPAR DADOS EXISTENTES (CUIDADO EM PRODUÇÃO!)
-- =====================================================
-- Descomente apenas se quiser resetar tudo:
-- TRUNCATE businesses, coupons, coupon_redemptions CASCADE;

-- =====================================================
-- 2. EMPRESAS DE TESTE
-- =====================================================

-- Senha padrão para todas: "senha123" (hash bcrypt)
-- $2a$10$YourHashHere (você precisa gerar o hash real)

INSERT INTO businesses (
  name, slug, description, 
  phone, whatsapp, email, 
  address, address_number, zip_code,
  password_hash, 
  status, plan_type,
  terms_accepted, terms_version
) VALUES 
-- Restaurantes
(
  'Pizzaria Bella Italia',
  'pizzaria-bella-italia',
  'A melhor pizza napolitana do Jardim Marajoara. Forno a lenha, ingredientes importados.',
  '(11) 5555-0001',
  '11955550001',
  'contato@bellaitalia.com.br',
  'Av. do Cursino',
  '234',
  '04671-000',
  '$2a$10$dummyhash', -- substitua por hash real
  'approved',
  'premium',
  true,
  '1.0.0'
),
(
  'Burger King Marajoara',
  'burger-king-marajoara',
  'Hamburgueria tradicional com os melhores sanduíches.',
  '(11) 5555-0002',
  '11955550002',
  'bk@marajoara.com.br',
  'Rua das Flores',
  '567',
  '04671-100',
  '$2a$10$dummyhash',
  'approved',
  'premium',
  true,
  '1.0.0'
),
(
  'Sushi Sakura',
  'sushi-sakura',
  'Culinária japonesa autêntica com peixes frescos diariamente.',
  '(11) 5555-0003',
  '11955550003',
  'contato@sushisakura.com.br',
  'Av. Marajoara',
  '890',
  '04671-200',
  '$2a$10$dummyhash',
  'approved',
  'basic',
  true,
  '1.0.0'
),

-- Beleza
(
  'Studio Beauty Nails',
  'studio-beauty-nails',
  'Especialistas em unhas decoradas e esmaltação em gel.',
  '(11) 5555-0004',
  '11955550004',
  'contato@beautynails.com.br',
  'Rua das Orquídeas',
  '123',
  '04671-300',
  '$2a$10$dummyhash',
  'approved',
  'premium',
  true,
  '1.0.0'
),
(
  'Salão Glamour',
  'salao-glamour',
  'Cortes modernos, coloração e tratamentos capilares.',
  '(11) 5555-0005',
  '11955550005',
  'glamour@salao.com.br',
  'Av. do Cursino',
  '456',
  '04671-400',
  '$2a$10$dummyhash',
  'approved',
  'basic',
  true,
  '1.0.0'
),

-- Pet Shop
(
  'Pet Shop Amigo Fiel',
  'pet-shop-amigo-fiel',
  'Tudo para seu pet: banho, tosa, rações e acessórios.',
  '(11) 5555-0006',
  '11955550006',
  'contato@amigofiel.com.br',
  'Rua dos Cães',
  '789',
  '04671-500',
  '$2a$10$dummyhash',
  'approved',
  'premium',
  true,
  '1.0.0'
),
(
  'Clínica Veterinária Marajoara',
  'clinica-veterinaria-marajoara',
  'Atendimento 24h para emergências. Vacinação e cirurgias.',
  '(11) 5555-0007',
  '11955550007',
  'vet@marajoara.com.br',
  'Av. Marajoara',
  '1234',
  '04671-600',
  '$2a$10$dummyhash',
  'approved',
  'basic',
  true,
  '1.0.0'
),

-- Saúde
(
  'Clínica Saúde & Vida',
  'clinica-saude-vida',
  'Clínica geral, pediatria e ginecologia. Convênios aceitos.',
  '(11) 5555-0008',
  '11955550008',
  'contato@saudevida.com.br',
  'Av. do Cursino',
  '987',
  '04671-700',
  '$2a$10$dummyhash',
  'approved',
  'premium',
  true,
  '1.0.0'
),
(
  'Farmácia Popular',
  'farmacia-popular',
  'Medicamentos, genéricos e manipulados. Entrega grátis.',
  '(11) 5555-0009',
  '11955550009',
  'farmacia@popular.com.br',
  'Rua da Saúde',
  '321',
  '04671-800',
  '$2a$10$dummyhash',
  'approved',
  'basic',
  true,
  '1.0.0'
),

-- Mercado
(
  'Mercado do Zé',
  'mercado-do-ze',
  'Mercearia tradicional do bairro. Produtos frescos diariamente.',
  '(11) 5555-0010',
  '11955550010',
  'ze@mercado.com.br',
  'Rua do Comércio',
  '45',
  '04671-900',
  '$2a$10$dummyhash',
  'approved',
  'basic',
  true,
  '1.0.0'
);

-- =====================================================
-- 3. ASSOCIAR EMPRESAS ÀS CATEGORIAS
-- =====================================================

INSERT INTO business_categories (business_id, category_id, is_primary)
SELECT 
  b.id,
  c.id,
  true
FROM businesses b
CROSS JOIN categories c
WHERE 
  (b.slug LIKE '%pizza%' AND c.slug = 'restaurantes') OR
  (b.slug LIKE '%burger%' AND c.slug = 'restaurantes') OR
  (b.slug LIKE '%sushi%' AND c.slug = 'restaurantes') OR
  (b.slug LIKE '%beauty%' AND c.slug = 'beleza') OR
  (b.slug LIKE '%salao%' AND c.slug = 'beleza') OR
  (b.slug LIKE '%pet%' AND c.slug = 'pet-shop') OR
  (b.slug LIKE '%veterinaria%' AND c.slug = 'pet-shop') OR
  (b.slug LIKE '%clinica-saude%' AND c.slug = 'saude') OR
  (b.slug LIKE '%farmacia%' AND c.slug = 'saude') OR
  (b.slug LIKE '%mercado%' AND c.slug = 'mercado');

-- =====================================================
-- 4. HORÁRIOS DE FUNCIONAMENTO
-- =====================================================

-- Adicionar horários padrão (Segunda a Sábado: 9h-18h)
INSERT INTO business_hours (business_id, day_of_week, open_time, close_time, is_closed)
SELECT 
  b.id,
  dow.day,
  CASE 
    WHEN dow.day = 0 THEN NULL -- Domingo fechado
    WHEN dow.day = 6 THEN '09:00'::TIME -- Sábado
    ELSE '09:00'::TIME -- Segunda a Sexta
  END,
  CASE 
    WHEN dow.day = 0 THEN NULL -- Domingo fechado
    WHEN dow.day = 6 THEN '13:00'::TIME -- Sábado até 13h
    ELSE '18:00'::TIME -- Segunda a Sexta até 18h
  END,
  CASE 
    WHEN dow.day = 0 THEN true -- Domingo fechado
    ELSE false
  END
FROM businesses b
CROSS JOIN (
  SELECT generate_series(0, 6) as day
) dow;

-- =====================================================
-- 5. CUPONS DE TESTE
-- =====================================================

INSERT INTO coupons (
  business_id,
  code,
  title,
  description,
  discount_type,
  discount_value,
  min_purchase,
  valid_until,
  usage_limit,
  is_active
)
SELECT
  b.id,
  UPPER(LEFT(b.slug, 3) || '20'),
  '20% de Desconto',
  'Válido para compras acima de R$ 50,00',
  'percentage',
  20,
  50,
  NOW() + INTERVAL '30 days',
  100,
  true
FROM businesses b
WHERE b.plan_type = 'premium'
LIMIT 5;

-- Cupons específicos
INSERT INTO coupons (
  business_id,
  code,
  title,
  description,
  discount_type,
  discount_value,
  valid_until,
  is_active
) VALUES
(
  (SELECT id FROM businesses WHERE slug = 'pizzaria-bella-italia'),
  'PIZZA10',
  '10% OFF em Pizzas Grandes',
  'Válido de segunda a quinta',
  'percentage',
  10,
  NOW() + INTERVAL '60 days',
  true
),
(
  (SELECT id FROM businesses WHERE slug = 'pet-shop-amigo-fiel'),
  'BANHOGRATIS',
  'Banho Grátis',
  'Na compra de 3 banhos, ganhe 1',
  'freebie',
  0,
  NOW() + INTERVAL '90 days',
  true
),
(
  (SELECT id FROM businesses WHERE slug = 'studio-beauty-nails'),
  'NAILS25',
  '25% OFF em Unhas de Gel',
  'Para novos clientes',
  'percentage',
  25,
  NOW() + INTERVAL '45 days',
  true
);

-- =====================================================
-- 6. RESGATES DE TESTE (COM LGPD)
-- =====================================================

-- Criar consentimentos de teste
INSERT INTO consent_logs (
  user_identifier_hash,
  consent_type,
  consent_given,
  consent_text,
  version,
  given_at
) VALUES
(
  hash_identifier('11999999999'),
  'terms',
  true,
  'Aceito os termos de uso para resgate de cupom',
  '1.0.0',
  NOW()
),
(
  hash_identifier('11888888888'),
  'terms',
  true,
  'Aceito os termos de uso para resgate de cupom',
  '1.0.0',
  NOW()
);

-- Adicionar alguns resgates de teste
INSERT INTO coupon_redemptions (
  coupon_id,
  business_id,
  customer_name,
  customer_phone,
  customer_email,
  consent_given,
  consent_id,
  terms_version,
  marketing_consent,
  redemption_code,
  redeemed_at
) VALUES
(
  (SELECT id FROM coupons WHERE code = 'PIZZA10' LIMIT 1),
  (SELECT business_id FROM coupons WHERE code = 'PIZZA10' LIMIT 1),
  'João Teste',
  '11999999999',
  'joao@teste.com',
  true,
  (SELECT id FROM consent_logs WHERE user_identifier_hash = hash_identifier('11999999999') LIMIT 1),
  '1.0.0',
  true,
  'ABC123',
  NOW() - INTERVAL '5 days'
),
(
  (SELECT id FROM coupons WHERE code = 'NAILS25' LIMIT 1),
  (SELECT business_id FROM coupons WHERE code = 'NAILS25' LIMIT 1),
  'Maria Teste',
  '11888888888',
  'maria@teste.com',
  true,
  (SELECT id FROM consent_logs WHERE user_identifier_hash = hash_identifier('11888888888') LIMIT 1),
  '1.0.0',
  false,
  'DEF456',
  NOW() - INTERVAL '2 days'
);

-- =====================================================
-- 7. ANALYTICS DE TESTE
-- =====================================================

-- Adicionar algumas visualizações
INSERT INTO analytics_events (business_id, event_type, event_data, ip_address_hash)
SELECT 
  b.id,
  'page_view',
  json_build_object('page', '/empresas/' || b.slug),
  hash_identifier('192.168.1.' || (random() * 255)::int::text)
FROM businesses b
CROSS JOIN generate_series(1, 10);

-- =====================================================
-- 8. WAITLIST DE TESTE
-- =====================================================

INSERT INTO waitlist (
  email,
  name,
  phone,
  business_type,
  consent_given,
  marketing_consent
) VALUES
('empresa1@teste.com', 'Empresa Teste 1', '11777777777', 'Restaurante', true, true),
('empresa2@teste.com', 'Empresa Teste 2', '11666666666', 'Loja', true, false),
('empresa3@teste.com', 'Empresa Teste 3', '11555555555', 'Serviços', true, true);

-- =====================================================
-- FIM DO SEED DATA
-- =====================================================

-- Verificar se os dados foram inseridos
SELECT 'Empresas criadas:' as info, COUNT(*) as total FROM businesses;
SELECT 'Cupons criados:' as info, COUNT(*) as total FROM coupons;
SELECT 'Resgates criados:' as info, COUNT(*) as total FROM coupon_redemptions;
SELECT 'Eventos analytics:' as info, COUNT(*) as total FROM analytics_events;