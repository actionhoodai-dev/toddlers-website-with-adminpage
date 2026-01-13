import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// This handles the case where env variables might be missing during build or runtime
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials are missing. Check your environment variables.")
}

export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-key"
)

if (process.env.NODE_ENV === "development") {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase environment variables are missing!")
    } else {
        console.log("Supabase client initialized with URL:", supabaseUrl)
    }
}
