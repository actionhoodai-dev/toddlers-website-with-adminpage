"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

interface GalleryImage {
    id: string
    title: string
    description: string
    image_url: string
    category: string
    display_order: number
    created_at: string
}

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("category", { ascending: true })
            .order("created_at", { ascending: false })

        if (data) setImages(data)
        setLoading(false)
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

            // Delete from storage and database
            const deletePromises = imagesToDelete.map(async (img) => {
                // Extract filename from URL
                const fileName = img.image_url.split('/').pop()

                if (fileName) {
                    // Delete from storage
                    await supabase.storage.from("gallery-images").remove([fileName])
                }

                // Delete from database
                await supabase.from("gallery").delete().eq("id", img.id)
            })

            await Promise.all(deletePromises)

            alert(`Successfully deleted ${selectedImages.size} image(s)`)
            setSelectedImages(new Set())
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
            const fileName = img.image_url.split('/').pop()

            if (fileName) {
                await supabase.storage.from("gallery-images").remove([fileName])
            }

            await supabase.from("gallery").delete().eq("id", img.id)

            alert("Image deleted successfully")
            fetchImages()
        } catch (error) {
            console.error("Delete error:", error)
            alert("Error deleting image. Please try again.")
        } finally {
            setDeleting(false)
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
                        <p className="text-sm text-gray-600 mt-1">Total: {images.length} images</p>
                    </div>
                    <div className="space-x-4 flex items-center">
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
                        <Link href="/admin/upload" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                            Upload New
                        </Link>
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
                                    <span className="text-teal-600">📁</span>
                                    {category}
                                    <span className="text-sm font-normal text-gray-500">({groupedImages[category].length})</span>
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {groupedImages[category].map(img => (
                                        <div
                                            key={img.id}
                                            className={`relative bg-white rounded-lg border-2 overflow-hidden group cursor-pointer transition-all ${selectedImages.has(img.id) ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => toggleSelection(img.id)}
                                        >
                                            {/* Selection Checkbox */}
                                            <div className="absolute top-2 left-2 z-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedImages.has(img.id)}
                                                    onChange={() => toggleSelection(img.id)}
                                                    className="h-5 w-5 rounded"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteSingle(img)
                                                }}
                                                disabled={deleting}
                                                className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                                                title="Delete this image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>

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
        </div>
    )
}
