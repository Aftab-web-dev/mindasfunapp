import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/customer-login', '/waiver-check-in']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and static assets
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const tokenKey = process.env.NEXT_PUBLIC_TOKEN_KEY || 'accessToken'
  const token = request.cookies.get(tokenKey)?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)

    loginUrl.searchParams.set('callbackUrl', pathname)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons, images, svgs (public assets)
     * - api routes (handled by route handlers)
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|images|svgs|sw.js|manifest.json|api).*)'
  ]
}
