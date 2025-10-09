// @ts-ignore
import nodemailer from 'nodemailer'
import { emailConfig } from '../config'

export async function sendEmailViaSMTP(
  to: string,
  subject: string,
  html: string
) {
  const transporter = nodemailer.createTransport(emailConfig.smtp)

  await transporter.sendMail({
    from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
    to,
    subject,
    html,
  })
}