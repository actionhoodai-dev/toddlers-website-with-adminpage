"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({ id: 1, gallery_enabled: true, max_gallery_images: 150 })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        async function fetchSettings() {
            const { data, error } = await supabase.from("site_settings").select("*").single()

            if (data) {
                setSettings(data)
            } else {
                // No settings exist - auto-create default row
                console.log("No settings found, creating default...")
                const { data: newData, error: insertError } = await supabase
                    .from("site_settings")
                    .insert({ id: 1, gallery_enabled: true, max_gallery_images: 150 })
                    .select()
                    .single()

                if (newData) {
                    setSettings(newData)
                } else {
                    console.error("Failed to create default settings:", insertError)
                }
            }
            setLoading(false)
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setMessage("")

        // Ensure id is always 1 for single-row constraint
        const payload = {
            id: 1,
            gallery_enabled: settings.gallery_enabled,
            max_gallery_images: settings.max_gallery_images
        }

        const { error } = await supabase
            .from("site_settings")
            .upsert(payload, { onConflict: 'id' })

        if (error) {
            console.error("Settings save error:", error)
            setMessage("Error saving settings: " + error.message)
        } else {
            setMessage("Settings saved successfully!")
        }
        setSaving(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
                    <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="font-medium text-gray-700">Gallery Enabled</label>
                                <input
                                    type="checkbox"
                                    checked={settings.gallery_enabled}
                                    onChange={e => setSettings({ ...settings, gallery_enabled: e.target.checked })}
                                    className="h-6 w-6 text-teal-600 rounded"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Max Gallery Images</label>
                                <input
                                    type="number"
                                    value={settings.max_gallery_images}
                                    onChange={e => setSettings({ ...settings, max_gallery_images: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">Controls the hard limit for uploads.</p>
                            </div>

                            {message && <p className={`text-sm ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
