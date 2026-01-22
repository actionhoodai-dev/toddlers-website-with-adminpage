import { db } from "@/lib/firebase/client"
import { doc, getDoc } from "firebase/firestore"
import { DEFAULT_CONTACT_INFO, type SiteSettings } from "@/lib/settings"

/**
 * Fetches site settings from Firestore on the server.
 */
export async function getSiteSettingsServer(): Promise<SiteSettings | null> {
    try {
        const docRef = doc(db, "site_settings", "default")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return docSnap.data() as SiteSettings
        }
        return null
    } catch (error) {
        console.error("Error fetching site settings (server):", error)
        return null
    }
}

export { DEFAULT_CONTACT_INFO }
