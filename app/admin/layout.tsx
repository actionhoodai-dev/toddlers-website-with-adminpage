"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/helpers"
import type { User } from "firebase/auth"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/admin/login") {
            setLoading(false)
            return
        }

        const checkAuth = async () => {
            const currentUser = await getCurrentUser()
            if (!currentUser) {
                router.push("/admin/login")
            } else {
                setUser(currentUser)
                setLoading(false)
            }
        }

        checkAuth()
    }, [pathname, router])

    if (loading && pathname !== "/admin/login") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        )
    }

    return <>{children}</>
}
