"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase/client"
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, addDoc } from "firebase/firestore"
import Link from "next/link"
import { Folder, Upload, Trash2, Edit2, X, Plus } from "lucide-react"

/**
 * Admin Gallery Manager - CLOUDINARY STORAGE
 * 
 * - Images: Stored in Cloudinary (via /api/upload)
 * - Metadata: Stored in Firestore (via Client SDK)
 */

interface GalleryImage {
    id: string
    title: string
    description: string
    src: string
    category: string
    created_at?: any // Firestore timestamp
    createdAt?: any // local date string fallback
    public_id?: string // Cloudinary ID for deletion
}

const CATEGORIES = [
    { id: "general", label: "General" },
    { id: "therapy", label: "Therapy" },
    { id: "facilities", label: "Facilities" },
    { id: "events", label: "Events" }
]

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null)

    // Upload State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [uploadFile, setUploadFile] = useState<File | null>(null)
    const [uploadData, setUploadData] = useState({ title: "", description: "", category: "general" })
    const [uploading, setUploading] = useState(false)

    // Edit State
    const [editData, setEditData] = useState({ title: "", description: "", category: "general" })
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        try {
            const q = query(
                collection(db, "gallery"),
                orderBy("created_at", "desc")
            )
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs.map(doc => {
                const d = doc.data()
                return {
                    id: doc.id,
                    ...d,
                }
            }) as GalleryImage[]
            setImages(data)
        } catch (error) {
            console.error("Error fetching gallery:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!uploadFile) return

        setUploading(true)

        try {
            // 1. Upload File to Cloudinary via API
            const formData = new FormData()
            formData.append("file", uploadFile)
            formData.append("category", uploadData.category)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Upload failed")
            }

            const fileData = await res.json()

            // 2. Save Metadata to Firestore
            await addDoc(collection(db, "gallery"), {
                title: uploadData.title,
                description: uploadData.description,
                category: uploadData.category,
                src: fileData.src, // Cloudinary URL
                public_id: fileData.id, // Cloudinary Public ID
                created_at: serverTimestamp()
            })

            alert("Success! Image uploaded to Cloudinary.")

            // Reset
            setIsUploadModalOpen(false)
            setUploadFile(null)
            setUploadData({ title: "", description: "", category: "general" })
            fetchImages()
        } catch (error: any) {
            console.error("Upload error:", error)
            alert(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (img: GalleryImage) => {
        if (!confirm(`Delete "${img.title}"? This cannot be undone.`)) return

        setDeleting(true)
        try {
            // 1. Delete from Cloudinary (if public_id exists)
            if (img.public_id) {
                await fetch('/api/upload', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ public_id: img.public_id })
                })
            }

            // 2. Delete Firestore Doc
            await deleteDoc(doc(db, "gallery", img.id))

            alert("Image deleted successfully")
            setPreviewImage(null)
            fetchImages()
        } catch (error) {
            console.error("Delete error:", error)
            alert("Error deleting image.")
        } finally {
            setDeleting(false)
        }
    }

    const handleSaveEdit = async () => {
        if (!previewImage) return

        setSaving(true)
        try {
            const docRef = doc(db, "gallery", previewImage.id)
            await updateDoc(docRef, {
                title: editData.title,
                description: editData.description,
                category: editData.category,
                updated_at: serverTimestamp()
            })

            alert("Image updated successfully!")
            setPreviewImage(null)
            fetchImages()
        } catch (error) {
            console.error("Update error:", error)
            alert("Error updating image.")
        } finally {
            setSaving(false)
        }
    }

    const openPreview = (img: GalleryImage) => {
        setPreviewImage(img)
        setEditData({
            title: img.title,
            description: img.description || "",
            category: img.category || "general"
        })
    }

    // Group images locally
    const groupedImages = images.reduce((acc, img) => {
        const cat = img.category || "general"
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(img)
        return acc
    }, {} as Record<string, GalleryImage[]>)

    const categories = Object.keys(groupedImages).sort()

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gallery Manager</h1>
                        <p className="text-sm text-gray-600 mt-1">Total: {images.length} images</p>
                    </div>

                    {/* Cloudinary Info Message */}
                    <div className="hidden md:block flex-1 max-w-xl mx-8 p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-800 text-sm">
                        <strong>☁️ Cloudinary Storage:</strong>
                        <span className="ml-2">Images serve instantly from global CDN.</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            Upload Image
                        </button>
                        <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900 border rounded-lg bg-white">
                            Dashboard
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading images...</div>
                ) : images.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                        <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-800">No images found</h3>
                        <p className="text-gray-500 mt-2">Upload your first image to get started.</p>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="mt-6 px-6 py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition"
                        >
                            Upload Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {categories.map(category => (
                            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize flex items-center gap-2">
                                    <Folder className="w-5 h-5 text-teal-600" />
                                    {category}
                                    <span className="text-sm font-normal text-gray-500">({groupedImages[category].length})</span>
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {groupedImages[category].map(img => (
                                        <div
                                            key={img.id}
                                            onClick={() => openPreview(img)}
                                            className="relative bg-white rounded-lg border-2 overflow-hidden group transition-all border-gray-200 hover:border-teal-300 cursor-pointer"
                                        >
                                            <div className="aspect-square relative flex items-center justify-center bg-gray-100">
                                                <img
                                                    src={img.src}
                                                    alt={img.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-semibold text-gray-800 truncate text-sm">{img.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {img.created_at ? new Date(img.created_at.seconds * 1000).toLocaleDateString() : 'Just now'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Upload New Image</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image File</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    {uploadFile ? (
                                        <div className="text-teal-600 font-medium flex items-center justify-center gap-2">
                                            <Folder className="w-5 h-5" />
                                            {uploadFile.name}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <span className="text-sm">Click to select or drag image here</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={uploadData.title}
                                    onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={uploadData.category}
                                    onChange={e => setUploadData({ ...uploadData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={uploadData.description}
                                    onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    rows={3}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {uploading ? "Uploading to Cloudinary..." : "Upload Image"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit/Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Edit Image</h2>
                                <button onClick={() => setPreviewImage(null)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image Preview */}
                                <div className="space-y-2">
                                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center min-h-[300px]">
                                        <img
                                            src={previewImage.src}
                                            alt={previewImage.title}
                                            className="max-w-full max-h-[400px] object-contain"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Added: {previewImage.created_at ? new Date(previewImage.created_at.seconds * 1000).toLocaleString() : 'Just now'}
                                    </p>
                                </div>

                                {/* Edit Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={editData.description}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={editData.category}
                                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={saving}
                                            className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(previewImage)}
                                            disabled={deleting}
                                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            {deleting ? "Deleting..." : "Delete Image"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
