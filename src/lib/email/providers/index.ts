import { emailConfig } from '../config'
import { sendEmailViaSMTP } from './smtp'
import { sendEmailViaResend } from './resend'

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  if (emailConfig.provider === 'resend') {
    return sendEmailViaResend(to, subject, html)
  }
  
  return sendEmailViaSMTP(to, subject, html)
}
