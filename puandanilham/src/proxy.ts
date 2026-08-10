import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.cookies.toString())
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([k, v]) =>
            response.headers.set(k, v)
          )
        },
      },
    }
  )

  // Refresh session before route handlers (latest @supabase/ssr pattern)
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  // Protect /admin — redirect unauthenticated users to login
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login')

  if (isAdminRoute && !isLoginPage && !claims) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Skip static files and images; run on all other routes
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
