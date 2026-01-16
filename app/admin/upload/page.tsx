"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { uploadImage } from "@/app/actions/upload-image"

export default function UploadPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("general")
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

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

            const result = await uploadImage(formData)

            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({ type: 'success', text: "Image uploaded successfully!" })
                setTitle("")
                setDescription("")
                setFile(null)
                setPreview(null)

                setTimeout(() => router.push("/admin/gallery"), 1500)
            }

        } catch (error: any) {
            console.error("Client Catch:", error)
            setMessage({ type: 'error', text: "Unexpected client error: " + error.message })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Upload Image</h1>
                    <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image Title *</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none">
                            <option value="general">General</option>
                            <option value="therapy">Therapy</option>
                            <option value="facilities">Facilities</option>
                            <option value="events">Events</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none" rows={3} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">File *</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" required />

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

                    <button type="submit" disabled={uploading} className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition disabled:opacity-50">
                        {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                </form>
            </div>
        </div>
    )
}
