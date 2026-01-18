"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function UploadPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("general")
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success' | 'warning', text: string } | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [settings, setSettings] = useState<any>(null)
    const [currentCount, setCurrentCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStatus() {
            // Fetch settings
            const { data: settingsData } = await supabase.from("site_settings").select("*").single()
            setSettings(settingsData)

            // Fetch current image count
            const { count } = await supabase.from("gallery").select("*", { count: "exact", head: true })
            setCurrentCount(count || 0)

            setLoading(false)
        }
        fetchStatus()
    }, [])

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null
        setFile(selectedFile)

        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile)
            setPreview(url)
            console.log("File selected:", selectedFile.name, selectedFile.size, selectedFile.type)
        } else {
            setPreview(null)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)
        setMessage(null)

        if (!file || !title) {
            setMessage({ type: 'error', text: "Please select a file and enter a title." })
            setUploading(false)
            return
        }

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("title", title)
            formData.append("category", category)
            formData.append("description", description)

            console.log("Submitting via API Route...")

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                console.error("API Error Response:", result)
                throw new Error(result.error || "Upload failed")
            }

            console.log("Upload Success:", result)
            setMessage({ type: 'success', text: "Image uploaded successfully!" })
            setTitle("")
            setDescription("")
            setFile(null)
            setPreview(null)

            setTimeout(() => router.push("/admin/gallery"), 1500)

        } catch (error: any) {
            console.error("Client Upload Catch:", error)
            setMessage({ type: 'error', text: "Error: " + error.message })
        } finally {
            setUploading(false)
        }
    }

    const isUploadDisabled = !settings?.gallery_enabled || (currentCount >= settings?.max_gallery_images)

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Upload Image</h1>
                    <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
                </div>

                {/* Status Info */}
                {!loading && settings && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Current Images: <strong>{currentCount}</strong></span>
                            <span className="text-gray-700">Max Allowed: <strong>{settings.max_gallery_images}</strong></span>
                            <span className={`font-semibold ${settings.gallery_enabled ? 'text-green-600' : 'text-red-600'}`}>
                                {settings.gallery_enabled ? 'Uploads Enabled' : 'Uploads Disabled'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Warning Messages */}
                {!loading && !settings?.gallery_enabled && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <strong>Warning:</strong> Gallery uploads are currently disabled in settings.
                    </div>
                )}

                {!loading && settings?.gallery_enabled && currentCount >= settings?.max_gallery_images && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
                        <strong>Warning:</strong> Maximum {settings.max_gallery_images} images reached. Please delete some images before uploading.
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            required
                            disabled={isUploadDisabled}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg outline-none"
                            disabled={isUploadDisabled}
                        >
                            <option value="general">General</option>
                            <option value="therapy">Therapy</option>
                            <option value="facilities">Facilities</option>
                            <option value="events">Events</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg outline-none"
                            rows={3}
                            disabled={isUploadDisabled}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">File *</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            required
                            disabled={isUploadDisabled}
                        />

                        {preview && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                <img src={preview} alt="Preview" className="h-48 w-auto rounded-lg border border-gray-200 object-cover" />
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600' :
                            message.type === 'warning' ? 'bg-orange-50 text-orange-600' :
                                'bg-green-50 text-green-600'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={uploading || isUploadDisabled}
                        className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? "Uploading..." : isUploadDisabled ? "Upload Disabled" : "Upload Image"}
                    </button>
                </form>
            </div>
        </div>
    )
}
