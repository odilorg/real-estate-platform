import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createVerificationToken, sendVerificationEmail } from "@/lib/verification"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: "If an account exists with this email, a verification link has been sent." },
        { status: 200 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      )
    }

    // Create new verification token and send email
    const token = await createVerificationToken(email)
    await sendVerificationEmail(email, user.name, token)

    return NextResponse.json(
      { message: "Verification email sent. Please check your inbox." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
