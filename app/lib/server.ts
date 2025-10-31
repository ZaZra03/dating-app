/**
 * Supabase client factory for server-side environments.
 * Creates a Supabase client instance configured for server-side usage with cookie-based session management.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase server client instance.
 * 
 * @returns Promise resolving to configured Supabase client for server usage
 * 
 * Important: Always create a new client instance within each function call.
 * Do not store this client in a global variable when using Fluid compute.
 * 
 * Uses environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY: Supabase anon/public key
 * 
 * Side effects:
 * - Reads and writes cookies for session management
 * - May silently fail cookie operations in Server Components (handled by middleware)
 * 
 * @example
 * const supabase = await createClient();
 * const { data } = await supabase.auth.getUser();
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore cookie set errors in Server Components
            // Middleware will handle session refresh
          }
        },
      },
    }
  )
}
