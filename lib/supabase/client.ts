import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

// Defensive check for runtime environment
if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        console.error("CRITICAL: Supabase environment variables are missing in the browser!")
    } else {
        console.error("CRITICAL: Supabase environment variables are missing on the server!")
    }
}

const validUrl = (supabaseUrl && supabaseUrl.startsWith("http")) ? supabaseUrl! : "https://example.supabase.co"
const validKey = (supabaseAnonKey && supabaseAnonKey.length > 0) ? supabaseAnonKey! : "example-key"

export const supabase = createBrowserClient(
    validUrl,
    validKey
)