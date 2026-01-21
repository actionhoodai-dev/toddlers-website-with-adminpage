"use client"

import { useEffect, useState } from "react"
import { getSiteSettings, DEFAULT_CONTACT_INFO, type SiteSettings } from "@/lib/settings"

export function useContactSettings() {
    const [settings, setSettings] = useState({
        address: DEFAULT_CONTACT_INFO.address,
        phone_primary: DEFAULT_CONTACT_INFO.phone_primary,
        phone_secondary: DEFAULT_CONTACT_INFO.phone_secondary,
        phone_tertiary: DEFAULT_CONTACT_INFO.phone_tertiary,
        email: DEFAULT_CONTACT_INFO.email,
        whatsapp_number: DEFAULT_CONTACT_INFO.whatsapp_number,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getSiteSettings().then((data) => {
            if (data) {
                setSettings({
                    address: data.address || DEFAULT_CONTACT_INFO.address,
                    phone_primary: data.phone_primary || DEFAULT_CONTACT_INFO.phone_primary,
                    phone_secondary: data.phone_secondary || DEFAULT_CONTACT_INFO.phone_secondary,
                    phone_tertiary: data.phone_tertiary || DEFAULT_CONTACT_INFO.phone_tertiary,
                    email: data.email || DEFAULT_CONTACT_INFO.email,
                    whatsapp_number: data.whatsapp_number || DEFAULT_CONTACT_INFO.whatsapp_number,
                })
            }
            setLoading(false)
        })
    }, [])

    return { settings, loading }
}
