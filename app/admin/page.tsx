"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"

export default function AdminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        gallery: 0,
        messages: 0,
        views: 0
    })

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/admin/login")
                return
            }
            setUser(user)

            // Fetch Stats
            const [galleryRes, messagesRes, viewsRes] = await Promise.all([
                supabase.from("gallery").select("*", { count: "exact", head: true }),
                supabase.from("contact_messages").select("*", { count: "exact", head: true }),
                supabase.from("page_views").select("*", { count: "exact", head: true })
            ])

            setStats({
                gallery: galleryRes.count || 0,
                messages: messagesRes.count || 0,
                views: viewsRes.count || 0
            })

            setLoading(false)
        }

        init()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/admin/login")
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium">
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard title="Gallery Images" count={stats.gallery} icon="image" color="teal" />
                    <StatsCard title="Contact Submissions" count={stats.messages} icon="mail" color="blue" />
                    <StatsCard title="Total Views" count={stats.views} icon="chart" color="purple" />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <QuickAction href="/admin/upload" label="Upload Image" icon="upload" color="teal" />
                        <QuickAction href="/admin/messages" label="View Messages" icon="mail-open" color="blue" />
                        <QuickAction href="/admin/settings" label="Settings" icon="settings" color="purple" />
                        <QuickAction href="/admin/analytics" label="Analytics" icon="chart-bar" color="green" />
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Account Information</h2>
                    <div className="space-y-2 text-gray-700">
                        <p><span className="font-semibold">Email:</span> {user?.email}</p>
                        <p><span className="font-semibold">User ID:</span> {user?.id}</p>
                        <p><span className="font-semibold">Status:</span> <span className="text-green-600 font-medium">Active</span></p>
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatsCard({ title, count, icon, color }: any) {
    const colors: any = { teal: "text-teal-600 bg-teal-100", blue: "text-blue-600 bg-blue-100", purple: "text-purple-600 bg-purple-100" }
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-600 font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{count}</p>
            </div>
            <div className={`rounded-full p-3 ${colors[color]}`}>
                {/* Icon placeholders - simplified for code brevity */}
                <div className="w-8 h-8 flex items-center justify-center font-bold text-xl">#</div>
            </div>
        </div>
    )
}

function QuickAction({ href, label, icon, color }: any) {
    const colors: any = {
        teal: "bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-200",
        blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
        purple: "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
        green: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
    }
    return (
        <Link href={href} className={`flex items-center gap-3 p-4 rounded-lg transition-colors border ${colors[color]}`}>
            <span className="font-medium text-gray-700">{label}</span>
        </Link>
    )
}
