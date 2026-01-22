"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase/client"
import { collection, getCountFromServer } from "firebase/firestore"
import { getCurrentUser, signOut } from "@/lib/auth/helpers"
import type { User } from "firebase/auth"
import Link from "next/link"

export default function AdminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        gallery: 0,
        messages: 0,
        services: 0,
        conditions: 0
    })

    useEffect(() => {
        const init = async () => {
            const user = await getCurrentUser()
            if (!user) {
                router.push("/admin/login")
                return
            }
            setUser(user)

            try {
                // Fetch Stats from Firestore
                const [gallerySnap, messagesSnap, servicesSnap, conditionsSnap] = await Promise.all([
                    getCountFromServer(collection(db, "gallery")),
                    getCountFromServer(collection(db, "contact_messages")),
                    getCountFromServer(collection(db, "services")),
                    getCountFromServer(collection(db, "conditions"))
                ])

                setStats({
                    gallery: gallerySnap.data().count,
                    messages: messagesSnap.data().count,
                    services: servicesSnap.data().count,
                    conditions: conditionsSnap.data().count
                })
            } catch (error) {
                console.error("Error fetching dashboard stats:", error)
            }

            setLoading(false)
        }

        init()
    }, [router])

    const handleLogout = async () => {
        await signOut()
        router.push("/admin/login")
    }


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="bg-card shadow-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors font-medium">
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard title="Gallery Images" count={stats.gallery} icon="image" color="teal" />
                    <StatsCard title="Contact Msgs" count={stats.messages} icon="mail" color="blue" />
                    <StatsCard title="Services" count={stats.services} icon="briefcase" color="purple" />
                    <StatsCard title="Conditions" count={stats.conditions} icon="activity" color="orange" />
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-xl shadow-lg p-6 border border-border mb-8">
                    <h2 className="text-xl font-bold mb-4">CMS Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <QuickAction href="/admin/services" label="Manage Services" icon="briefcase" color="purple" />
                        <QuickAction href="/admin/conditions" label="Manage Conditions" icon="activity" color="orange" />
                        <QuickAction href="/admin/contact-settings" label="Contact Settings" icon="phone" color="green" />
                    </div>

                    <h2 className="text-xl font-bold mb-4 border-t border-border pt-6">Gallery & Messages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <QuickAction href="/admin/upload" label="Upload Image" icon="upload" color="teal" />
                        <QuickAction href="/admin/gallery" label="Manage Gallery" icon="image" color="teal" />
                        <QuickAction href="/admin/messages" label="View Messages" icon="mail-open" color="blue" />
                        <QuickAction href="/admin/settings" label="Site Settings" icon="settings" color="gray" />
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
                    <h2 className="text-xl font-bold mb-4">Account Information</h2>
                    <div className="space-y-2 text-muted-foreground">
                        <p><span className="font-semibold text-foreground">Email:</span> {user?.email}</p>
                        <p><span className="font-semibold text-foreground">User ID:</span> {user?.uid}</p>
                        <p><span className="font-semibold text-foreground">Status:</span> <span className="text-green-600 font-medium">Active</span></p>
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
        purple: "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
    }
    return (
        <Link href={href} className={`flex items-center gap-3 p-4 rounded-lg transition-colors border ${colors[color]}`}>
            <span className="font-medium text-gray-700">{label}</span>
        </Link>
    )
}
