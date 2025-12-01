import nodemailer from 'nodemailer'

// Create transporter with SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  // Skip if email is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('Email not configured, skipping notification to:', to)
    return { success: false, reason: 'Email not configured' }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `EstateHub <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

interface NewMessageEmailData {
  recipientName: string
  recipientEmail: string
  senderName: string
  propertyTitle: string
  propertyUrl: string
  messagePreview: string
  conversationUrl: string
}

export async function sendNewMessageNotification({
  recipientName,
  recipientEmail,
  senderName,
  propertyTitle,
  propertyUrl,
  messagePreview,
  conversationUrl,
}: NewMessageEmailData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
  const fullConversationUrl = `${appUrl}${conversationUrl}`
  const fullPropertyUrl = `${appUrl}${propertyUrl}`

  const subject = `New message from ${senderName} about your property`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">EstateHub</h1>
      </div>

      <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="margin-top: 0;">Hi ${recipientName || 'there'},</p>

        <p>You have received a new message from <strong>${senderName}</strong> regarding your property:</p>

        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #1d4ed8;">
            <a href="${fullPropertyUrl}" style="color: #1d4ed8; text-decoration: none;">${propertyTitle}</a>
          </p>
          <p style="margin: 0; color: #6b7280; font-style: italic;">"${messagePreview}"</p>
        </div>

        <a href="${fullConversationUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 10px;">
          View Conversation
        </a>

        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          You're receiving this email because someone messaged you on EstateHub.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} EstateHub. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: recipientEmail,
    subject,
    html,
  })
}
