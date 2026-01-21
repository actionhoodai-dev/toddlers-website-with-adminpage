"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Save, MapPin, Phone, Mail, MessageCircle } from "lucide-react"

interface ContactSettings {
    address: string
    phone_primary: string
    phone_secondary: string
    phone_tertiary: string
    email: string
    whatsapp_number: string
}

export default function ContactSettingsPage() {
    const [settings, setSettings] = useState<ContactSettings>({
        address: "",
        phone_primary: "",
        phone_secondary: "",
        phone_tertiary: "",
        email: "",
        whatsapp_number: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from("site_settings")
            .select("address, phone_primary, phone_secondary, phone_tertiary, email, whatsapp_number")
            .eq("id", 1)
            .single()

        if (error) {
            console.error("Error fetching settings:", error)
            setMessage({ type: "error", text: "Failed to load settings" })
        } else if (data) {
            setSettings({
                address: data.address || "",
                phone_primary: data.phone_primary || "",
                phone_secondary: data.phone_secondary || "",
                phone_tertiary: data.phone_tertiary || "",
                email: data.email || "",
                whatsapp_number: data.whatsapp_number || "",
            })
        }
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)

        const { error } = await supabase
            .from("site_settings")
            .update({
                address: settings.address,
                phone_primary: settings.phone_primary,
                phone_secondary: settings.phone_secondary,
                phone_tertiary: settings.phone_tertiary,
                email: settings.email,
                whatsapp_number: settings.whatsapp_number,
            })
            .eq("id", 1)

        if (error) {
            console.error("Error saving settings:", error)
            setMessage({ type: "error", text: "Failed to save settings. Please try again." })
        } else {
            setMessage({ type: "success", text: "Contact settings saved successfully!" })
            setTimeout(() => setMessage(null), 3000)
        }

        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Contact Information Settings</h1>
                <p className="text-muted-foreground">
                    Manage global contact information displayed across the website (footer, contact page, WhatsApp button, etc.)
                </p>
            </div>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg border ${message.type === "success"
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-red-50 border-red-200 text-red-800"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                {/* Address */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <MapPin size={16} className="text-primary" />
                        Address
                    </label>
                    <textarea
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        rows={3}
                        placeholder="Enter full address"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                    />
                </div>

                {/* Phone Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                            <Phone size={16} className="text-primary" />
                            Primary Phone
                        </label>
                        <input
                            type="tel"
                            value={settings.phone_primary}
                            onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                            placeholder="9597744300"
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                            <Phone size={16} className="text-muted-foreground" />
                            Secondary Phone
                        </label>
                        <input
                            type="tel"
                            value={settings.phone_secondary}
                            onChange={(e) => setSettings({ ...settings, phone_secondary: e.target.value })}
                            placeholder="9865935809"
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                            <Phone size={16} className="text-muted-foreground" />
                            Tertiary Phone
                        </label>
                        <input
                            type="tel"
                            value={settings.phone_tertiary}
                            onChange={(e) => setSettings({ ...settings, phone_tertiary: e.target.value })}
                            placeholder="9677638738"
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Mail size={16} className="text-primary" />
                        Email
                    </label>
                    <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="toddlersmstc@gmail.com"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                </div>

                {/* WhatsApp Number */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <MessageCircle size={16} className="text-green-600" />
                        WhatsApp Number
                    </label>
                    <input
                        type="tel"
                        value={settings.whatsapp_number}
                        onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                        placeholder="919597744300 (include country code)"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Include country code (e.g., 91 for India). Format: 919597744300
                    </p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-border">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Usage Info */}
            <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Where This Information Appears:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Footer (all pages)</li>
                    <li>• Contact page</li>
                    <li>• WhatsApp floating button</li>
                    <li>• Call Now buttons</li>
                    <li>• Email links (mailto:)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                    <strong>Note:</strong> Changes will be reflected immediately across the entire website.
                </p>
            </div>
        </div>
    )
}
