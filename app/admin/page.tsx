"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("admin_authenticated")
    if (auth) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("admin_authenticated")
              redirect("/admin/login")
            }}
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
