import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

// This handles the case where env variables might be missing during build or runtime
if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials are missing. Check your environment variables.")
}

export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseKey || "placeholder-key"
)

if (process.env.NODE_ENV === "development") {
    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase environment variables are missing!")
    }
}