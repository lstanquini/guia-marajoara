export const emailConfig = {
  // Trocar aqui quando mudar de email
  from: {
    name: 'MarajoaraON',
    email: process.env.EMAIL_FROM || 'noreply@guiamarajoara.com'
  },
  
  // Trocar aqui quando mudar de provedor
  provider: (process.env.EMAIL_PROVIDER || 'smtp') as 'smtp' | 'resend',
  
  // Configs SMTP (Gmail ou profissional)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    }
  },
  
  // Configs Resend (futuro)
  resend: {
    apiKey: process.env.RESEND_API_KEY || ''
  }
}