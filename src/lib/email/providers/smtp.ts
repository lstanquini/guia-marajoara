import { emailConfig } from '../config'

export async function sendEmailViaSMTP(
  to: string,
  subject: string,
  html: string
) {
  // Importação dinâmica do Nodemailer para garantir compatibilidade com Node.js runtime
  const nodemailer = await import('nodemailer')

  const transporter = nodemailer.default.createTransport(emailConfig.smtp)

  await transporter.sendMail({
    from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
    to,
    subject,
    html,
  })
}