interface ApprovalEmailData {
  businessName: string
  responsibleName: string
  email: string
  password: string
  planType: 'basic' | 'premium'
  loginUrl: string
  // ✅ NOVO: Limites dinâmicos do banco
  maxCoupons: number
  maxPhotos: number
  isFeatured: boolean
}

export function getApprovalEmail(data: ApprovalEmailData) {
  // ✅ Features dinâmicas baseadas nos limites reais
  const features = [
    data.maxCoupons >= 999 
      ? '✓ Cupons ilimitados' 
      : `✓ Até ${data.maxCoupons} cupons ativos`,
    data.maxPhotos >= 999 
      ? '✓ Fotos ilimitadas' 
      : `✓ Até ${data.maxPhotos} fotos`,
    '✓ Perfil completo no guia',
    '✓ Contatos e redes sociais visíveis',
  ]

  // Adiciona features extras se tiver
  if (data.isFeatured) {
    features.push('✓ Destaque na página inicial')
  }

  if (data.planType === 'premium') {
    features.push('✓ Badge Premium')
    features.push('✓ Prioridade nos resultados')
  }

  const planInfo = {
    name: data.planType === 'premium' ? 'Premium' : 'Básico',
    color: data.planType === 'premium' ? '#7c3aed' : '#ea580c',
    bgColor: data.planType === 'premium' ? '#f3e8ff' : '#fff7ed',
    borderColor: data.planType === 'premium' ? '#a855f7' : '#f97316',
    features
  }

  return {
    subject: `🎉 ${data.businessName} - Empresa Aprovada no Guia Marajoara!`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background: #f5f5f5; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white; 
    }
    .header { 
      background: linear-gradient(135deg, #C2227A 0%, #A01860 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 18px;
      opacity: 0.95;
    }
    .content { 
      padding: 40px 30px; 
    }
    .credentials { 
      background: #f9f9f9; 
      padding: 20px; 
      border-radius: 8px; 
      margin: 25px 0; 
      border-left: 4px solid #C2227A; 
    }
    .credential-item { 
      margin: 15px 0; 
    }
    .credential-label { 
      font-weight: bold; 
      color: #666; 
      font-size: 14px;
      margin-bottom: 5px;
    }
    .credential-value { 
      background: white; 
      padding: 12px 15px; 
      border-radius: 4px; 
      margin-top: 5px; 
      font-family: 'Courier New', monospace; 
      font-size: 16px;
      word-break: break-all;
    }
    .plan-box { 
      background: ${planInfo.bgColor}; 
      border: 2px solid ${planInfo.borderColor}; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 25px 0; 
    }
    .plan-title { 
      color: ${planInfo.color}; 
      font-size: 20px; 
      font-weight: bold; 
      margin-bottom: 15px; 
    }
    .features { 
      list-style: none; 
      padding: 0; 
      margin: 0;
    }
    .features li { 
      padding: 8px 0; 
      color: #555; 
    }
    .button { 
      display: inline-block; 
      background: #C2227A; 
      color: white !important; 
      padding: 15px 40px; 
      text-decoration: none; 
      border-radius: 5px; 
      font-weight: bold; 
      margin: 20px 0;
    }
    .steps { 
      background: #f0f9ff; 
      border-left: 4px solid #0284c7; 
      padding: 20px; 
      border-radius: 4px; 
      margin: 25px 0; 
    }
    .steps h3 {
      margin: 0 0 15px 0;
      color: #0369a1;
    }
    .steps ol { 
      margin: 10px 0; 
      padding-left: 20px; 
    }
    .steps li { 
      margin: 8px 0; 
    }
    .alert { 
      background: #fff3cd; 
      border-left: 4px solid #ffc107; 
      padding: 15px; 
      margin: 25px 0; 
      border-radius: 4px; 
    }
    .footer { 
      text-align: center; 
      color: #666; 
      font-size: 12px; 
      padding: 30px; 
      background: #f9f9f9; 
    }
    .footer p {
      margin: 5px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px 15px !important;
      }
      .header {
        padding: 30px 15px !important;
      }
      .button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Parabéns!</h1>
      <p>Sua empresa foi aprovada!</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px;">Olá <strong>${data.responsibleName}</strong>,</p>
      
      <p>É com grande satisfação que informamos que a empresa <strong>${data.businessName}</strong> foi aprovada no <strong>Guia Marajoara</strong>! 🎊</p>
      
      <div class="plan-box">
        <div class="plan-title">📋 Plano ${planInfo.name}</div>
        <ul class="features">
          ${planInfo.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      
      <h3 style="color: #333; margin-top: 30px;">🔑 Suas Credenciais de Acesso</h3>
      
      <div class="credentials">
        <div class="credential-item">
          <div class="credential-label">Email de Login:</div>
          <div class="credential-value">${data.email}</div>
        </div>
        <div class="credential-item">
          <div class="credential-label">Senha Temporária:</div>
          <div class="credential-value">${data.password}</div>
        </div>
      </div>
      
      <div class="steps">
        <h3>🚀 Próximos Passos</h3>
        <ol>
          <li><strong>Acesse o painel</strong> usando o botão abaixo</li>
          <li><strong>Complete seu cadastro</strong> (adicione endereço completo)</li>
          <li><strong>Personalize seu perfil</strong> (logo, banner, fotos, descrição)</li>
          <li><strong>Crie seus cupons</strong> de desconto para atrair clientes</li>
        </ol>
      </div>
      
      <div style="text-align: center;">
        <a href="${data.loginUrl}" class="button">Acessar Painel de Controle</a>
      </div>
      
      <div class="alert">
        <strong>⚠️ Importante:</strong> Sua empresa só aparecerá no site público após completar o cadastro com todas as informações, especialmente o endereço completo.
      </div>
      
      <p style="margin-top: 30px;">Se tiver qualquer dúvida, responda este email ou entre em contato conosco.</p>
      
      <p><strong>Bem-vindo à família Guia Marajoara!</strong> 🤝</p>
    </div>
    
    <div class="footer">
      <p style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">Guia Marajoara</p>
      <p>Conectando negócios locais aos clientes</p>
      <p style="margin-top: 15px; color: #999;">Este é um email automático, mas você pode responder se precisar de ajuda.</p>
    </div>
  </div>
</body>
</html>
    `
  }
}