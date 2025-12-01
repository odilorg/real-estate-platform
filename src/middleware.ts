import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

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

        // If it's a protected route, require authentication
        if (isProtectedRoute) {
          return !!token
        }

        // Allow access to non-protected routes
        return true
      },
    },
    pages: {
      signIn: '/sign-in',
    },
  }
)

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
