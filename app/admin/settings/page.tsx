"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase/client"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import Link from "next/link"

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({ gallery_enabled: true, max_gallery_images: 150 })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        async function fetchSettings() {
            try {
                const docRef = doc(db, "site_settings", "default")
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setSettings(docSnap.data())
                } else {
                    // No settings exist - auto-create default row in Firestore
                    console.log("No settings found in Firestore, creating default...")
                    const defaultSettings = {
                        gallery_enabled: true,
                        max_gallery_images: 150,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                    await setDoc(docRef, defaultSettings)
                    setSettings(defaultSettings)
                }
            } catch (err) {
                console.error("Unexpected error loading settings:", err)
                setMessage("Error loading settings")
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setMessage("")

        try {
            const docRef = doc(db, "site_settings", "default")
            await updateDoc(docRef, {
                gallery_enabled: settings.gallery_enabled,
                max_gallery_images: settings.max_gallery_images,
                updated_at: new Date().toISOString()
            })

            setMessage("Settings saved successfully!")
            setTimeout(() => setMessage(""), 3000)
        } catch (err: any) {
            console.error("Unexpected save error:", err)
            setMessage("Error saving: " + err.message)
        } finally {
            setSaving(false)
        }
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
                                <div>
                                    <label className="font-medium text-gray-700">Gallery Enabled</label>
                                    <p className="text-sm text-gray-500 mt-1">
                                        When disabled, no new images can be uploaded
                                    </p>
                                </div>
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
                                    min="1"
                                    max="1000"
                                    value={settings.max_gallery_images}
                                    onChange={e => setSettings({ ...settings, max_gallery_images: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">Controls the hard limit for uploads. Upload API enforces this.</p>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                    {message}
                                </div>
                            )}

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
