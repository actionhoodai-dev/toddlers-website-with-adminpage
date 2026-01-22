"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import imageCompression from "browser-image-compression"
import { db } from "@/lib/firebase/client"
import { doc, getDoc, collection, getCountFromServer } from "firebase/firestore"

/**
 * Admin Upload Page - INTENTIONALLY DISABLED
 * 
 * This page allows admins to view the upload interface but prevents actual uploads:
 * - Form fields are disabled
 * - Upload button shows "Upload Disabled (Storage Pending)"
 * - Clear warning message displayed to users
 * - Image compression functionality remains (for future use)
 * 
 * DISABLED BECAUSE:
 * - No storage backend configured (Firebase Storage not used per requirements)
 * - Supabase Storage removed during production cleanup
 * - Gallery feature is gracefully disabled for production safety
 * 
 * DO NOT enable this without configuring a storage backend first.
 * See app/actions/upload-image.ts for the server action (also disabled).
 */

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
    const [compressing, setCompressing] = useState(false)
    const [compressionInfo, setCompressionInfo] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStatus() {
            try {
                // Fetch settings from Firestore
                const docRef = doc(db, "site_settings", "default")
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setSettings(docSnap.data())
                }

                // Fetch current image count from Firestore
                const galleryColl = collection(db, "gallery")
                const countSnap = await getCountFromServer(galleryColl)
                setCurrentCount(countSnap.data().count)
            } catch (error) {
                console.error("Error fetching upload status:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStatus()
    }, [])

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null

        if (!selectedFile) {
            setFile(null)
            setPreview(null)
            setCompressionInfo(null)
            return
        }

        try {
            setCompressing(true)
            setCompressionInfo(null)
            const originalSize = selectedFile.size

            console.log("Original file:", selectedFile.name, (originalSize / 1024 / 1024).toFixed(2), "MB")

            // Compression options - targeting ~1.5 MB
            const options = {
                maxSizeMB: 1.5,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: selectedFile.type,
            }

            // Compress the image
            const compressedFile = await imageCompression(selectedFile, options)
            const compressedSize = compressedFile.size

            console.log("Compressed file:", compressedFile.name, (compressedSize / 1024 / 1024).toFixed(2), "MB")

            // Set the compressed file
            setFile(compressedFile)

            // Generate preview from compressed file
            const url = URL.createObjectURL(compressedFile)
            setPreview(url)

            // Show compression info
            const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(0)
            setCompressionInfo(
                `Image optimized: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(compressedSize / 1024 / 1024).toFixed(1)}MB (${reduction}% reduction)`
            )

        } catch (error: any) {
            console.error("Compression error:", error)
            setMessage({
                type: 'error',
                text: "Failed to compress image. Please try a different image or contact support."
            })
            setFile(null)
            setPreview(null)
            setCompressionInfo(null)
        } finally {
            setCompressing(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage({ type: 'warning', text: "Image uploads are temporarily disabled. Storage setup pending." })
    }

    const isUploadDisabled = true // Force disabled for storage cleanup

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

                {/* Storage Pending Message */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    <p className="font-bold flex items-center gap-2">
                        <span>⚠️</span> Storage Setup Pending
                    </p>
                    <p className="text-sm mt-1">Image uploads are temporarily disabled. Storage setup pending.</p>
                </div>

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
                            disabled={isUploadDisabled || compressing}
                        />

                        {compressing && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-blue-700">Optimizing image for web...</span>
                            </div>
                        )}

                        {compressionInfo && !compressing && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700">{compressionInfo}</p>
                                <p className="text-xs text-green-600 mt-1">Image optimized for web before upload</p>
                            </div>
                        )}

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
                        disabled={true}
                        className="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
                    >
                        Upload Disabled (Storage Pending)
                    </button>
                </form>
            </div>
        </div>
    )
}
