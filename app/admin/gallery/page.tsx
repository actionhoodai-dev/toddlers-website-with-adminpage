"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase/client"
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc, writeBatch, serverTimestamp } from "firebase/firestore"
import Link from "next/link"
import { Folder } from "lucide-react"

/**
 * Admin Gallery Manager - UPLOADS DISABLED, VIEWING ENABLED
 * 
 * This page allows viewing and managing existing gallery metadata stored in Firestore:
 * - View images grouped by category
 * - Edit image metadata (title, description, category)
 * - Delete images from database
 * - Bulk operations (select multiple, delete selected)
 * 
 * UPLOADS ARE DISABLED:
 * - No storage backend configured (Firebase Storage not used per requirements)
 * - Supabase Storage removed during production cleanup
 * - Upload button is grayed out with explanatory text
 * 
 * DO NOT enable uploads without configuring a storage backend first.
 */


interface GalleryImage {
    id: string
    title: string
    description: string
    image_url: string
    category: string
    display_order: number
    created_at: any
}

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
    const [deleting, setDeleting] = useState(false)
    const [selectMode, setSelectMode] = useState(false) // NEW: explicit select mode
    const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null) // NEW: for preview/edit modal
    const [editData, setEditData] = useState<{ title: string; description: string; category: string }>({ title: "", description: "", category: "general" })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        try {
            // Simplified query - orders by created_at only (no composite index needed)
            // Category grouping is handled client-side in the UI
            const q = query(
                collection(db, "gallery"),
                orderBy("created_at", "desc")
            )
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GalleryImage[]
            setImages(data)
        } catch (error) {
            console.error("Error fetching gallery:", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedImages)
        if (newSelection.has(id)) {
            newSelection.delete(id)
        } else {
            newSelection.add(id)
        }
        setSelectedImages(newSelection)
    }

    const selectAll = () => {
        if (selectedImages.size === images.length) {
            setSelectedImages(new Set())
        } else {
            setSelectedImages(new Set(images.map(img => img.id)))
        }
    }

    const handleDeleteSelected = async () => {
        if (selectedImages.size === 0) return

        const confirmed = confirm(`Are you sure you want to delete ${selectedImages.size} image(s)? This cannot be undone.`)
        if (!confirmed) return

        setDeleting(true)

        try {
            const imagesToDelete = images.filter(img => selectedImages.has(img.id))
            const batch = writeBatch(db)

            // 1. Delete from Firestore
            imagesToDelete.forEach(img => {
                const docRef = doc(db, "gallery", img.id)
                batch.delete(docRef)
            })
            await batch.commit()

            alert(`Successfully deleted ${selectedImages.size} image(s) from database.`)
            setSelectedImages(new Set())
            setSelectMode(false) // Exit select mode after delete
            fetchImages()
        } catch (error) {
            console.error("Delete error:", error)
            alert("Error deleting images. Please try again.")
        } finally {
            setDeleting(false)
        }
    }

    const handleDeleteSingle = async (img: GalleryImage) => {
        const confirmed = confirm(`Delete "${img.title}"? This cannot be undone.`)
        if (!confirmed) return

        setDeleting(true)

        try {
            // 1. Delete Firestore metadata
            await deleteDoc(doc(db, "gallery", img.id))

            alert("Image deleted from database successfully")
            setPreviewImage(null) // Close modal after delete
            fetchImages()
        } catch (error) {
            console.error("Delete error:", error)
            alert("Error deleting image. Please try again.")
        } finally {
            setDeleting(false)
        }
    }

    // NEW: Open preview/edit modal
    const openPreview = (img: GalleryImage) => {
        setPreviewImage(img)
        setEditData({
            title: img.title,
            description: img.description,
            category: img.category
        })
    }

    // NEW: Save edited metadata
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
            alert("Error updating image. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    // Group images by category
    const groupedImages = images.reduce((acc, img) => {
        const category = img.category || "uncategorized"
        if (!acc[category]) acc[category] = []
        acc[category].push(img)
        return acc
    }, {} as Record<string, GalleryImage[]>)

    const categories = Object.keys(groupedImages).sort()

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Gallery Manager</h1>
                        <p className="text-sm text-gray-600 mt-1">Total: {images.length} images (Metadata only)</p>
                    </div>

                    {/* Storage Pending Message */}
                    <div className="flex-1 max-w-md mx-8 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                        <strong>⚠️ Storage Pending:</strong> Gallery storage is currently being migrated. Updates are disabled.
                    </div>
                    <div className="space-x-4 flex items-center">
                        {selectMode ? (
                            <>
                                <button
                                    onClick={() => {
                                        setSelectMode(false)
                                        setSelectedImages(new Set())
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel Selection
                                </button>
                                {selectedImages.size > 0 && (
                                    <button
                                        onClick={handleDeleteSelected}
                                        disabled={deleting}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {deleting ? "Deleting..." : `Delete Selected (${selectedImages.size})`}
                                    </button>
                                )}
                                <button
                                    onClick={selectAll}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    {selectedImages.size === images.length ? "Deselect All" : "Select All"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setSelectMode(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Select Multiple
                                </button>
                                <button
                                    disabled
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                                >
                                    Upload Disabled
                                </button>
                            </>
                        )}
                        <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading images...</div>
                ) : images.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No images uploaded yet.</div>
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
                                            className={`relative bg-white rounded-lg border-2 overflow-hidden group transition-all ${selectMode
                                                ? selectedImages.has(img.id)
                                                    ? 'border-teal-500 ring-2 ring-teal-200'
                                                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                                                : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                                                }`}
                                            onClick={() => {
                                                if (selectMode) {
                                                    toggleSelection(img.id)
                                                } else {
                                                    openPreview(img)
                                                }
                                            }}
                                        >
                                            {/* Selection Checkbox - only visible in select mode */}
                                            {selectMode && (
                                                <div className="absolute top-2 left-2 z-10">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedImages.has(img.id)}
                                                        onChange={() => toggleSelection(img.id)}
                                                        className="h-5 w-5 rounded"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            )}

                                            <div className="aspect-square relative">
                                                <img
                                                    src={img.image_url}
                                                    alt={img.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Error"
                                                    }}
                                                />
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-semibold text-gray-800 truncate text-sm">{img.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(img.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview/Edit Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Edit Image</h2>
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image Preview */}
                                <div>
                                    <img
                                        src={previewImage.image_url}
                                        alt={previewImage.title}
                                        className="w-full rounded-lg border border-gray-200"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Uploaded: {new Date(previewImage.created_at).toLocaleString()}
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
                                            <option value="general">General</option>
                                            <option value="therapy">Therapy</option>
                                            <option value="facilities">Facilities</option>
                                            <option value="events">Events</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={saving}
                                            className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSingle(previewImage)}
                                            disabled={deleting}
                                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
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
