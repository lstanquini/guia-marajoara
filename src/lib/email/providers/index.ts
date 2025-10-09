import { emailConfig } from '../config'
import { sendEmailViaSMTP } from './smtp'
import { sendEmailViaResend } from './resend'

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  console.log(`📧 Enviando email via ${emailConfig.provider}`)
  console.log(`📤 De: ${emailConfig.from.name} <${emailConfig.from.email}>`)
  console.log(`📥 Para: ${to}`)
  
  if (emailConfig.provider === 'resend') {
    return sendEmailViaResend(to, subject, html)
  }
  
  return sendEmailViaSMTP(to, subject, html)
}