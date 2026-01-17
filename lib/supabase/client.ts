import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// This handles the case where env variables might be missing during build or runtime
if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        console.warn("Supabase credentials are missing. Check your environment variables.")
    }
}

const validUrl = (supabaseUrl && supabaseUrl.startsWith("http")) ? supabaseUrl : "https://example.supabase.co"
const validKey = (supabaseAnonKey && supabaseAnonKey.length > 0) ? supabaseAnonKey : "example-key"

export const supabase = createBrowserClient(
    validUrl,
    validKey
)