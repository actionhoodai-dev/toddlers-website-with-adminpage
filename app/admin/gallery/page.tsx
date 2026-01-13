"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  visible: boolean
  order: number
}

export default function GalleryAdmin() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    // Check if user is authenticated via Supabase session
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setIsAuthenticated(true)
          fetchGalleryItems()
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/admin/login")
      }
    }
    checkUser()
  }, [router])

  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("order", { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      console.error("Error fetching gallery items:", error.message)
      toast.error("Failed to load gallery items")
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) {
      toast.error("Please provide a title and select an image")
      return
    }

    try {
      setUploading(true)

      // 1. Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath)

      // 3. Save metadata to Database
      const { data, error: dbError } = await supabase
        .from("gallery")
        .insert([
          {
            title,
            description,
            image_url: publicUrl,
            visible: true,
            order: items.length + 1,
          },
        ])
        .select()

      if (dbError) throw dbError

      if (data) {
        setItems([...items, data[0]])
        toast.success("Image added successfully")
      }

      setTitle("")
      setDescription("")
      setFile(null)
      // Reset file input
      const fileInput = document.getElementById("file") as HTMLInputElement
      if (fileInput) fileInput.value = ""

    } catch (error: any) {
      console.error("Error adding image:", error.message)
      toast.error("Failed to add image")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      // 1. Delete from storage if it's a supabase URL
      if (imageUrl.includes("supabase.co")) {
        const path = imageUrl.split("/").pop()
        if (path) {
          await supabase.storage.from("gallery").remove([`gallery/${path}`])
        }
      }

      // 2. Delete from database
      const { error } = await supabase.from("gallery").delete().eq("id", id)
      if (error) throw error

      setItems(items.filter((item) => item.id !== id))
      toast.success("Image deleted")
    } catch (error: any) {
      console.error("Error deleting image:", error.message)
      toast.error("Failed to delete image")
    }
  }

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const { error } = await supabase
        .from("gallery")
        .update({ visible: !currentVisible })
        .eq("id", id)

      if (error) throw error

      setItems(items.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)))
    } catch (error: any) {
      console.error("Error updating visibility:", error.message)
      toast.error("Failed to update visibility")
    }
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === items.length - 1)) {
      return
    }

    const newItems = [...items]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const originalItem = newItems[index]
    const targetItem = newItems[targetIndex]

    // Swap orders in DB
    try {
      const { error: err1 } = await supabase.from("gallery").update({ order: targetItem.order }).eq("id", originalItem.id)
      const { error: err2 } = await supabase.from("gallery").update({ order: originalItem.order }).eq("id", targetItem.order)

      if (err1 || err2) throw err1 || err2

        // Swap in UI
        ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
      setItems(newItems)
    } catch (error: any) {
      console.error("Error reordering:", error.message)
      toast.error("Failed to reorder")
    }
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
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

              <div className="md:col-span-1">
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

              <div className="md:col-span-1">
                <label htmlFor="file" className="block text-sm font-medium text-foreground mb-2">
                  Image File *
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-1.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                "Add Image"
              )}
            </button>
          </form>
        </div>

        {/* Gallery Items */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Loading gallery items...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Preview</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
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
                        <td className="px-6 py-4">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded border border-border"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-foreground">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                        </td>
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
                            onClick={() => handleToggleVisibility(item.id, item.visible)}
                            className={`p-2 rounded-lg transition-colors ${item.visible
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                          >
                            {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(item.id, item.image_url)}
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
          )}
        </div>
      </div>
    </div>
  )
}
