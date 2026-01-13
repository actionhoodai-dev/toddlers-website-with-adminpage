"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated via Supabase session
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setIsAuthenticated(true)
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Verifying session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/gallery"
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all hover:border-primary/50"
          >
            <h2 className="text-xl font-bold text-foreground mb-2">Gallery Management</h2>
            <p className="text-muted-foreground">Upload, manage, and organize gallery images</p>
          </Link>

          <div className="bg-card border border-border rounded-lg p-6 opacity-50 cursor-not-allowed">
            <h2 className="text-xl font-bold text-foreground mb-2">Users</h2>
            <p className="text-muted-foreground">Coming soon</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 opacity-50 cursor-not-allowed">
            <h2 className="text-xl font-bold text-foreground mb-2">Settings</h2>
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
