import { createClient } from "@/lib/supabase/server"
import { DEFAULT_CONTACT_INFO, type SiteSettings } from "@/lib/settings"

export async function getSiteSettingsServer(): Promise<SiteSettings | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single()

    if (error) {
        console.error("Error fetching site settings (server):", error)
        return null
    }

    return data
}

export { DEFAULT_CONTACT_INFO }
