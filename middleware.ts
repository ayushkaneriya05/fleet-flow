import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-fleet-flow-key-change-in-production'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login, register and public assets
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('fleetflow_session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Decode and verify the JWT using 'jose' for Edge compatibility
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    const role = payload.role as string

    // Clone headers to attach user info (Optional but helps downstream handlers)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId as string)
    requestHeaders.set('x-user-role', role)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // Role-Based Access Control (RBAC) Enforcements
    switch (role) {
      case 'DISPATCHER':
        if (pathname.startsWith('/analytics') || pathname.startsWith('/drivers')) {
            return new NextResponse('Forbidden: Analytics access requires Finance or Fleet Manager role', { status: 403 })
        }
        break
      case 'FINANCE_ANALYST':
        if (pathname.startsWith('/trips/new') || pathname.startsWith('/vehicles')) {
           return new NextResponse('Forbidden: Action requires Dispatcher or Fleet Manager role', { status: 403 })
        }
        break
      case 'SAFETY_OFFICER':
        if (pathname.startsWith('/trips') || pathname.startsWith('/analytics')) {
           return new NextResponse('Forbidden: Action requires different role', { status: 403 })
        }
        break
      case 'FLEET_MANAGER':
        // Full access
        break
      default:
        return new NextResponse('Forbidden: Invalid Role', { status: 403 })
    }

    return response
  } catch (error) {
    // Invalid or expired token
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
