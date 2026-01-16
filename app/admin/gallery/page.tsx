"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function AdminGalleryPage() {
    const [images, setImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchImages = async () => {
            const { data, error } = await supabase
                .from("gallery")
                .select("*")
                .order("created_at", { ascending: false })

            if (data) setImages(data)
            setLoading(false)
        }
        fetchImages()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Gallery Manager</h1>
                    <div className="space-x-4">
                        <Link href="/admin/upload" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">Upload New</Link>
                        <Link href="/admin" className="px-4 py-2 text-gray-600 hover:text-gray-900">Dashboard</Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading images...</div>
                ) : images.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No images uploaded yet.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {images.map(img => (
                            <div key={img.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                                <div className="aspect-square relative">
                                    <img
                                        src={img.image_url}
                                        alt={img.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Uplaod+Error"
                                        }}
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-800 truncate">{img.title}</h3>
                                    <p className="text-xs text-gray-500 uppercase">{img.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
