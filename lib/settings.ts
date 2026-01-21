import { supabase } from "@/lib/supabase/client"

export interface SiteSettings {
    id: number
    gallery_enabled: boolean
    max_gallery_images: number
    address: string | null
    phone_primary: string | null
    phone_secondary: string | null
    phone_tertiary: string | null
    email: string | null
    whatsapp_number: string | null
    created_at: string
    updated_at: string
}

/**
 * Fetches site settings from Supabase.
 * Used for displaying contact information across the site.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single()

    if (error) {
        console.error("Error fetching site settings:", error)
        return null
    }

    return data
}

/**
 * Default fallback contact info (in case database is unavailable)
 */
export const DEFAULT_CONTACT_INFO = {
    address: "No.74, North Park street, Gobichettipalayam, Erode District, Pin: 638452",
    phone_primary: "9597744300",
    phone_secondary: "9865935809",
    phone_tertiary: "9677638738",
    email: "toddlersmstc@gmail.com",
    whatsapp_number: "919597744300",
}
