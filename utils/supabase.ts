import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const validUrl = (supabaseUrl && supabaseUrl.startsWith("http")) ? supabaseUrl : "https://example.supabase.co"
const validKey = (supabaseAnonKey && supabaseAnonKey.length > 0) ? supabaseAnonKey : "example-key"

export const supabase = createClient(validUrl, validKey);
