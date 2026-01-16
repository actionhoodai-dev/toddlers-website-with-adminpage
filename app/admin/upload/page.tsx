"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function UploadPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("general")
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
    const [galleryCount, setGalleryCount] = useState<number | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        async function checkLimit() {
            try {
                const { count, error } = await supabase.from("gallery").select("*", { count: "exact", head: true })
                if (error) {
                    console.error("Limit Check Error:", error)
                    return // Don't block UI on limit check error, but log it
                }
                setGalleryCount(count || 0)
            } catch (e) {
                console.error("Limit Check Crash:", e)
            }
        }
        checkLimit()
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
        } else {
            setPreview(null)
        }
    }

    const testConnection = async () => {
        setMessage({ type: 'success', text: "Testing connection... check console." })
        try {
            console.log("Testing Storage Connection to 'gallery-images'...")
            const { data, error } = await supabase.storage.from('gallery-images').list()
            if (error) {
                console.error("Storage Test Failed:", error)
                alert(`Connection Test Failed: ${error.message}`)
            } else {
                console.log("Storage Test Passed. Found items:", data)
                alert(`Connection Test Passed! Bucket 'gallery-images' is accessible. Found ${data.length} items.`)
            }
        } catch (e: any) {
            console.error("Test Crashed:", e)
            alert(`Test Crashed: ${e.message}`)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Upload started...")
        setUploading(true)
        setMessage(null)

        const { data: { session }, error: authError } = await supabase.auth.getSession()
        if (authError || !session) {
            console.error("Auth Error:", authError)
            setMessage({ type: 'error', text: "You must be logged in to upload." })
            setUploading(false)
            return
        }

        if (!file || !title) {
            setMessage({ type: 'error', text: "Please select a file and enter a title." })
            setUploading(false)
            return
        }

        if (galleryCount !== null && galleryCount >= 150) {
            setMessage({ type: 'error', text: "Gallery limit reached (150 images)." })
            setUploading(false)
            return
        }

        try {
            const fileExt = file.name.split('.').pop() || 'jpg'
            const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
            const fileName = `${Date.now()}_${safeTitle}.${fileExt}`
            const filePath = fileName

            console.log("Uploading to bucket 'gallery-images' at path:", filePath)

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("gallery-images")
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error("Storage Upload Error:", uploadError)
                throw new Error(`Storage Error: ${uploadError.message}`)
            }

            console.log("Upload success, data:", uploadData)

            const { data: { publicUrl } } = supabase.storage
                .from("gallery-images")
                .getPublicUrl(filePath)

            console.log("Got public URL:", publicUrl)

            const { error: dbError } = await supabase.from("gallery").insert({
                title,
                description,
                category,
                image_url: publicUrl,
                display_order: 0
            })

            if (dbError) {
                console.error("DB Insert Error:", dbError)
                throw new Error(`Database Error: ${dbError.message}`)
            }

            setMessage({ type: 'success', text: "Image uploaded successfully!" })
            setTitle("")
            setDescription("")
            setFile(null)
            setPreview(null)
            setGalleryCount(prev => (prev || 0) + 1)

            setTimeout(() => router.push("/admin/gallery"), 1500) // Redirect to gallery manager

        } catch (error: any) {
            console.error("Handle Upload Catch:", error)
            setMessage({ type: 'error', text: error.message || "Upload failed. Check console." })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Upload Image</h1>
                    <div className="space-x-4">
                        <button type="button" onClick={testConnection} className="text-sm text-teal-600 hover:text-teal-800 underline">Test Connection</button>
                        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
                    </div>
                </div>

                {galleryCount !== null && galleryCount >= 130 && (
                    <div className={`mb-4 p-3 rounded-lg ${galleryCount >= 150 ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        Current Count: {galleryCount}/150. {galleryCount >= 150 ? "Limit Reached." : "Approaching limit."}
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image Title *</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" required disabled={galleryCount! >= 150} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none" disabled={galleryCount! >= 150}>
                            <option value="general">General</option>
                            <option value="therapy">Therapy</option>
                            <option value="facilities">Facilities</option>
                            <option value="events">Events</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none" rows={3} disabled={galleryCount! >= 150} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">File *</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" required disabled={galleryCount! >= 150} />

                        {preview && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                <img src={preview} alt="Preview" className="h-48 w-auto rounded-lg border border-gray-200 object-cover" />
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" disabled={uploading || galleryCount! >= 150} className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition disabled:opacity-50">
                        {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                </form>
            </div>
        </div>
    )
}
