"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle, Mail, Home } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations("auth")
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend">(
    token ? "loading" : "resend"
  )
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (token) {
      verifyToken(token)
    }
  }, [token])

  const verifyToken = async (token: string) => {
    try {
      const res = await fetch(`/api/auth/verify-email?token=${token}`)
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage(data.message || "Email verified successfully!")
      } else {
        setStatus("error")
        setMessage(data.error || "Verification failed")
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setResending(true)
    setMessage("")

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || "Verification email sent!")
      } else {
        setMessage(data.error || "Failed to send verification email")
      }
    } catch {
      setMessage("Something went wrong. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
              <Home className="h-8 w-8" />
              EstateHub
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">
            {status === "loading" && "Verifying..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
            {status === "resend" && "Verify Your Email"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "resend" && "Enter your email to receive a new verification link"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Verifying your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-gray-600 text-center mb-6">{message}</p>
              <Button onClick={() => router.push("/sign-in")}>
                Sign In
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-gray-600 text-center mb-6">{message}</p>
              <Button
                variant="outline"
                onClick={() => setStatus("resend")}
              >
                Request New Link
              </Button>
            </div>
          )}

          {status === "resend" && (
            <form onSubmit={handleResend} className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <Mail className="h-12 w-12 text-blue-600 mb-4" />
              </div>

              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.includes("sent")
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}>
                  {message}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={resending}
                />
              </div>

              <Button type="submit" className="w-full" disabled={resending}>
                {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Verification Link
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Remember your password?{" "}
                <Link href="/sign-in" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
