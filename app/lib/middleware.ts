/**
 * Middleware function for Supabase session management.
 * Handles session refresh and authentication checks for protected routes.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Updates and validates the user session from Supabase.
 * Redirects unauthenticated users to the login page if accessing protected routes.
 * 
 * @param request - The incoming Next.js request
 * @returns NextResponse for continuing the request or redirecting to login
 * 
 * Behavior:
 * - Creates a new Supabase client for each request (required for Fluid compute)
 * - Validates user session via getClaims()
 * - Redirects to /auth/login if user is not authenticated and accessing protected routes
 * - Allows access to /login and /auth routes without authentication
 * 
 * Important:
 * - Must return the supabaseResponse object as-is to maintain cookie sync
 * - Do not create new NextResponse objects without copying cookies
 * 
 * @example
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
