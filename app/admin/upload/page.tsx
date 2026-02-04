"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Legacy Upload Page Redirect
 * 
 * This page is deprecated. Upload functionality has been moved 
 * to the main gallery manager at /admin/gallery
 */

export default function UploadPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace("/admin/gallery")
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-xl font-bold text-gray-800">Redirecting...</h1>
                <p className="text-gray-500">Moving to Gallery Manager</p>
            </div>
        </div>
    )
}
