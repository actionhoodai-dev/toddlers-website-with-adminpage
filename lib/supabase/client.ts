import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// This handles the case where env variables might be missing during build or runtime
if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        console.warn("Supabase credentials are missing. Check your environment variables.")
    }
}

export const supabase = createBrowserClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-key"
)