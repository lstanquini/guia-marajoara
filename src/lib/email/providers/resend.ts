import { emailConfig } from '../config'

export async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string
) {
  // Importação dinâmica do Resend para garantir compatibilidade
  const { Resend } = await import('resend')
  const resend = new Resend(emailConfig.resend.apiKey)

  await resend.emails.send({
    from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
    to,
    subject,
    html,
  })
}