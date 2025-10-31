/**
 * Supabase client factory for browser environments.
 * Creates a Supabase client instance configured for client-side usage.
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client instance.
 * 
 * @returns Configured Supabase client for browser usage
 * 
 * Uses environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY: Supabase anon/public key
 * 
 * @example
 * const supabase = createClient();
 * const { data } = await supabase.from('messages').select();
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
  )
}
