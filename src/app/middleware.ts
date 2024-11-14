// app/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware function
export function middleware(req: NextRequest) {
  // Check for a token in the request headers
  const token = req.headers.get('Authorization')

  if (!token) {
    // If the token is missing, redirect to the login page
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // You can add further validation logic for the token here

  // If the token is valid, continue to the requested page
  return NextResponse.next()
}

// Specify the routes where the middleware should run
export const config = {
  matcher: ['/protected/:path*'] // Adjust this to your routes
}
