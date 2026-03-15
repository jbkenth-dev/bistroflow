import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths
  const isPublicAdminPath = 
    path === '/admin/login' || 
    path === '/admin/forgot-password' || 
    path === '/admin/verify-otp' || 
    path === '/admin/new-password'
  
  const isAdminPath = path.startsWith('/admin')

  // Get session token
  const hasSession = request.cookies.has('admin_session')

  // NOTE: In a real production app, we should verify the JWT/Session token server-side here
  // to check the role ('admin' vs 'staff').
  // Since 'admin_session' cookie is just a flag currently set by both admin and staff login,
  // we cannot distinguish roles purely by cookie presence in this middleware without decoding a JWT.
  // For now, we rely on the client-side AdminShell/StaffShell for strict role redirection,
  // but we enforce authentication presence here.

  // Redirect logic
  if (isAdminPath && !isPublicAdminPath && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (path === '/admin/login' && hasSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
