import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check for session token cookie (next-auth stores session here)
  const sessionToken = request.cookies.get('next-auth.session-token') || 
                       request.cookies.get('__Secure-next-auth.session-token')

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/properties/new',
    '/properties/edit',
    '/messages',
    '/favorites',
    '/profile',
    '/agent/dashboard',
    '/admin',
    '/become-agent',
  ]

  // Check if the current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // If it's a protected route and no session token, redirect to sign-in
  if (isProtectedRoute && !sessionToken) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/properties/new',
    '/properties/edit/:path*',
    '/messages/:path*',
    '/favorites/:path*',
    '/profile',
    '/profile/:path*',
    '/agent/:path*',
    '/admin/:path*',
    '/become-agent/:path*',
  ],
}
