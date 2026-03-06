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
