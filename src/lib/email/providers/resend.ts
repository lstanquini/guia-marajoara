import { Resend } from 'resend'
import { emailConfig } from '../config'

const resend = new Resend(emailConfig.resend.apiKey)

export async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string
) {
  await resend.emails.send({
    from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
    to,
    subject,
    html,
  })
}