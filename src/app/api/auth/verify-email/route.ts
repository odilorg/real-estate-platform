import { NextRequest, NextResponse } from "next/server"
import { verifyEmail } from "@/lib/verification"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      )
    }

    const result = await verifyEmail(token)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
