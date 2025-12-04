import crypto from 'crypto'
import { prisma } from './prisma'
import { sendEmail } from './email'

// Generate a secure verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Create verification token in database
export async function createVerificationToken(email: string): Promise<string> {
  const token = generateVerificationToken()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return token
}

// Verify token and mark email as verified
export async function verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return { success: false, error: 'Invalid verification token' }
  }

  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token },
    })
    return { success: false, error: 'Verification token has expired' }
  }

  // Update user's emailVerified field
  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  })

  // Delete used token
  await prisma.verificationToken.delete({
    where: { token },
  })

  return { success: true }
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  name: string | null,
  token: string
): Promise<{ success: boolean; error?: unknown }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verificationUrl = `${appUrl}/verify-email?token=${token}`

  const subject = 'Verify your email address - EstateHub'

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
        <p style="margin-top: 0;">Hi ${name || 'there'},</p>

        <p>Thank you for registering on EstateHub! Please verify your email address to complete your registration.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          This link will expire in 24 hours. If you did not create an account, you can ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

        <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">
          If the button does not work, copy and paste this link:
        </p>
        <p style="color: #6b7280; font-size: 12px; word-break: break-all; margin-top: 5px;">
          ${verificationUrl}
        </p>
      </div>

      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} EstateHub. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject,
    html,
  })
}
