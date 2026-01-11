"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Upload, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react"

interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  visible: boolean
  order: number
}

export default function GalleryAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [items, setItems] = useState<GalleryItem[]>([
    {
      id: "1",
      title: "Therapy Session",
      description: "Patient during occupational therapy",
      image_url: "/therapy-session.png",
      visible: true,
      order: 1,
    },
    {
      id: "2",
      title: "Center Interior",
      description: "Our welcoming rehabilitation center",
      image_url: "/rehabilitation-center.jpg",
      visible: true,
      order: 2,
    },
  ])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated")
    if (!auth) {
      redirect("/admin/login")
    }
    setIsAuthenticated(true)
    setLoading(false)
  }, [])

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const newItem: GalleryItem = {
      id: Date.now().toString(),
      title,
      description,
      image_url: "/placeholder.svg?height=300&width=300&query=" + title,
      visible: true,
      order: items.length + 1,
    }

    setItems([...items, newItem])
    setTitle("")
    setDescription("")
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleToggleVisibility = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)))
  }

  const handleReorder = (id: string, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === items.length - 1)) {
      return
    }

    const newItems = [...items]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    setItems(newItems)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <nav className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-primary hover:text-primary/90 transition-colors">
            ← Back to Admin
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Gallery Management</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Form */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Upload size={20} />
            Add New Image
          </h2>

          <form onSubmit={handleAddImage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Image Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter image title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="Optional description"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
            >
              Add Image
            </button>
          </form>
        </div>

        {/* Gallery Items */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Visible</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No gallery items yet. Add your first image above.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.description || "—"}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleReorder(item.id, "up")}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => handleReorder(item.id, "down")}
                            disabled={index === items.length - 1}
                            className="p-1 rounded hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleVisibility(item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            item.visible
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
