-- =====================================================
-- GUIA MARAJOARA - LGPD COMPLIANCE FUNCTIONS
-- Versão: 1.0.0
-- Data: 15/09/2025
-- 
-- Funções específicas para conformidade com LGPD
-- =====================================================

-- =====================================================
-- 1. FUNÇÕES DE CRIPTOGRAFIA
-- =====================================================

-- Configurar chave de criptografia (MUDAR EM PRODUÇÃO!)
DO $$
BEGIN
  -- Esta chave deve ser mantida em segredo e fazer backup!
  PERFORM set_config('app.encryption_key', 'ChaveSuperSecreta32CaracteresOK', false);
END $$;

-- Função para criptografar dados sensíveis
CREATE OR REPLACE FUNCTION encrypt_sensitive(data TEXT)
RETURNS TEXT AS $$
BEGIN
  IF data IS NULL OR data = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN encode(
    encrypt(
      data::bytea,
      current_setting('app.encryption_key')::bytea,
      'aes'
    ),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para descriptografar dados
CREATE OR REPLACE FUNCTION decrypt_sensitive(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
  IF encrypted_data IS NULL OR encrypted_data = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN convert_from(
    decrypt(
      decode(encrypted_data, 'base64'),
      current_setting('app.encryption_key')::bytea,
      'aes'
    ),
    'UTF8'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. FUNÇÕES DE ANONIMIZAÇÃO
-- =====================================================

-- Anonimizar dados pessoais de um resgate específico
CREATE OR REPLACE FUNCTION anonymize_redemption(redemption_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE coupon_redemptions
  SET
    customer_name = 'ANONIMIZADO',
    customer_phone = '00000000000',
    customer_email = 'anonimizado@exemplo.com',
    anonymized = true,
    anonymized_at = NOW()
  WHERE id = redemption_id
    AND anonymized = false;
    
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Anonimizar todos os dados expirados
CREATE OR REPLACE FUNCTION anonymize_expired_data()
RETURNS INTEGER AS $$
DECLARE
  rows_affected INTEGER;
BEGIN
  WITH updated AS (
    UPDATE coupon_redemptions
    SET
      customer_name = 'ANONIMIZADO',
      customer_phone = '00000000000',
      customer_email = 'anonimizado@exemplo.com',
      anonymized = true,
      anonymized_at = NOW()
    WHERE data_expires_at < NOW()
      AND anonymized = false
    RETURNING 1
  )
  SELECT COUNT(*) INTO rows_affected FROM updated;
  
  RETURN rows_affected;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. FUNÇÕES DE EXPORTAÇÃO DE DADOS (LGPD Art. 18)
-- =====================================================

-- Exportar todos os dados de um usuário (direito de portabilidade)
CREATE OR REPLACE FUNCTION export_user_data(user_phone TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'data_request_date', NOW(),
    'user_identifier', hash_identifier(user_phone),
    'redemptions', (
      SELECT json_agg(row_to_json(r))
      FROM (
        SELECT 
          c.title as coupon_title,
          r.redeemed_at,
          r.redemption_code,
          b.name as business_name
        FROM coupon_redemptions r
        JOIN coupons c ON r.coupon_id = c.id
        JOIN businesses b ON r.business_id = b.id
        WHERE r.customer_phone = user_phone
          AND r.anonymized = false
      ) r
    ),
    'consents', (
      SELECT json_agg(row_to_json(cl))
      FROM (
        SELECT 
          consent_type,
          consent_given,
          given_at,
          revoked_at,
          version
        FROM consent_logs
        WHERE user_identifier_hash = hash_identifier(user_phone)
      ) cl
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. FUNÇÕES DE EXCLUSÃO (DIREITO AO ESQUECIMENTO)
-- =====================================================

-- Solicitar exclusão de dados
CREATE OR REPLACE FUNCTION request_data_deletion(user_phone TEXT)
RETURNS UUID AS $$
DECLARE
  request_id UUID;
BEGIN
  -- Criar registro de solicitação
  request_id := uuid_generate_v4();
  
  -- Marcar resgates para exclusão
  UPDATE coupon_redemptions
  SET data_expires_at = NOW() + INTERVAL '30 days'
  WHERE customer_phone = user_phone
    AND anonymized = false;
  
  -- Revogar consentimentos
  UPDATE consent_logs
  SET revoked_at = NOW()
  WHERE user_identifier_hash = hash_identifier(user_phone)
    AND revoked_at IS NULL;
  
  -- Log da solicitação
  INSERT INTO analytics_events (
    event_type,
    event_data,
    created_at
  ) VALUES (
    'data_deletion_requested',
    json_build_object(
      'request_id', request_id,
      'user_hash', hash_identifier(user_phone),
      'scheduled_for', NOW() + INTERVAL '30 days'
    ),
    NOW()
  );
  
  RETURN request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. FUNÇÕES DE CONSENTIMENTO
-- =====================================================

-- Registrar novo consentimento
CREATE OR REPLACE FUNCTION register_consent(
  p_identifier TEXT,
  p_type TEXT,
  p_given BOOLEAN,
  p_text TEXT,
  p_version TEXT,
  p_ip INET DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  consent_id UUID;
BEGIN
  INSERT INTO consent_logs (
    user_identifier_hash,
    consent_type,
    consent_given,
    consent_text,
    version,
    ip_address,
    given_at
  ) VALUES (
    hash_identifier(p_identifier),
    p_type,
    p_given,
    p_text,
    p_version,
    p_ip,
    NOW()
  ) RETURNING id INTO consent_id;
  
  RETURN consent_id;
END;
$$ LANGUAGE plpgsql;

-- Verificar se usuário tem consentimento válido
CREATE OR REPLACE FUNCTION has_valid_consent(
  p_identifier TEXT,
  p_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  is_valid BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM consent_logs
    WHERE user_identifier_hash = hash_identifier(p_identifier)
      AND consent_type = p_type
      AND consent_given = true
      AND revoked_at IS NULL
      AND expires_at > NOW()
    ORDER BY given_at DESC
    LIMIT 1
  ) INTO is_valid;
  
  RETURN is_valid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. TRIGGERS DE LGPD
-- =====================================================

-- Trigger para criptografar dados sensíveis automaticamente
CREATE OR REPLACE FUNCTION encrypt_business_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Criptografar CPF/CNPJ se fornecido
  IF NEW.cpf_cnpj_encrypted IS NOT NULL AND NEW.cpf_cnpj_encrypted NOT LIKE 'enc:%' THEN
    NEW.cpf_cnpj_encrypted := 'enc:' || encrypt_sensitive(NEW.cpf_cnpj_encrypted);
  END IF;
  
  -- Criptografar nome do responsável
  IF NEW.responsible_name_encrypted IS NOT NULL AND NEW.responsible_name_encrypted NOT LIKE 'enc:%' THEN
    NEW.responsible_name_encrypted := 'enc:' || encrypt_sensitive(NEW.responsible_name_encrypted);
  END IF;
  
  -- Criptografar telefone do responsável
  IF NEW.responsible_phone_encrypted IS NOT NULL AND NEW.responsible_phone_encrypted NOT LIKE 'enc:%' THEN
    NEW.responsible_phone_encrypted := 'enc:' || encrypt_sensitive(NEW.responsible_phone_encrypted);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de criptografia
CREATE TRIGGER encrypt_business_data_trigger
  BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_business_data();

-- =====================================================
-- 7. VIEWS SEGURAS (SEM DADOS SENSÍVEIS)
-- =====================================================

-- View pública de empresas (sem dados sensíveis)
CREATE OR REPLACE VIEW public_businesses AS
SELECT 
  id,
  name,
  slug,
  description,
  logo_url,
  phone,
  whatsapp,
  email,
  website,
  instagram,
  address,
  address_number,
  neighborhood,
  city,
  state,
  rating,
  reviews_count,
  plan_type,
  created_at
FROM businesses
WHERE status = 'approved'
  AND deleted_at IS NULL
  AND is_active = true;

-- View de estatísticas de cupons (anonimizada)
CREATE OR REPLACE VIEW coupon_statistics AS
SELECT 
  c.id as coupon_id,
  c.title,
  c.code,
  COUNT(r.id) as total_redemptions,
  COUNT(CASE WHEN r.validated_at IS NOT NULL THEN 1 END) as validated_redemptions,
  c.valid_until,
  b.name as business_name
FROM coupons c
LEFT JOIN coupon_redemptions r ON c.id = r.coupon_id
JOIN businesses b ON c.business_id = b.id
GROUP BY c.id, c.title, c.code, c.valid_until, b.name;

-- =====================================================
-- 8. JOBS AGENDADOS (MANUTENÇÃO LGPD)
-- =====================================================

-- Função para limpeza diária LGPD
CREATE OR REPLACE FUNCTION daily_lgpd_maintenance()
RETURNS void AS $$
DECLARE
  anonymized_count INTEGER;
  expired_consents INTEGER;
BEGIN
  -- Anonimizar dados expirados
  SELECT anonymize_expired_data() INTO anonymized_count;
  
  -- Revogar consentimentos expirados
  UPDATE consent_logs
  SET revoked_at = NOW()
  WHERE expires_at < NOW()
    AND revoked_at IS NULL
  RETURNING COUNT(*) INTO expired_consents;
  
  -- Log da manutenção
  INSERT INTO analytics_events (
    event_type,
    event_data,
    created_at
  ) VALUES (
    'lgpd_daily_maintenance',
    json_build_object(
      'anonymized_records', anonymized_count,
      'expired_consents', expired_consents,
      'execution_time', NOW()
    ),
    NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIM DO LGPD COMPLIANCE
-- =================================================