import { db } from "@/lib/firebase/client"
import { doc, getDoc } from "firebase/firestore"

export interface SiteSettings {
    id?: number
    gallery_enabled: boolean
    max_gallery_images: number
    address: string | null
    phone_primary: string | null
    phone_secondary: string | null
    phone_tertiary: string | null
    email: string | null
    whatsapp_number: string | null
    created_at?: any
    updated_at?: any
}

/**
 * Fetches site settings from Firestore (single document 'default' in collection 'site_settings').
 * Used for displaying contact information across the site.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const docRef = doc(db, "site_settings", "default")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return docSnap.data() as SiteSettings
        }
        return null
    } catch (error) {
        console.error("Error fetching site settings:", error)
        return null
    }
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
