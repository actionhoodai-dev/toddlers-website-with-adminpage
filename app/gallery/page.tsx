"use client"

import { useState, useEffect } from "react"
import { Folder } from "lucide-react"
import { db } from "@/lib/firebase/client"
import { collection, query, orderBy, getDocs } from "firebase/firestore"

interface GalleryImage {
  id: string
  title: string
  description: string
  src: string
  category: string
  created_at?: any
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  therapy: "Therapy",
  facilities: "Facilities",
  events: "Events"
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(
          collection(db, "gallery"),
          orderBy("created_at", "desc")
        )
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => {
          const d = doc.data()
          return {
            id: doc.id,
            ...d,
            src: d.src || d.image_url
          }
        }) as GalleryImage[]
        setImages(data)
      } catch (error) {
        console.error("Failed to load gallery:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const filteredImages = activeCategory === "all"
    ? images
    : images.filter(img => img.category === activeCategory)

  // Get unique categories that actually have images
  const availableCategories = ["all", ...Array.from(new Set(images.map(img => img.category || "general")))]

  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-foreground animate-fade-in-up">Gallery</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Glimpses of our rehabilitation center and the impact we make
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Filter */}
          {!loading && images.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    }`}
                >
                  {cat === "all" ? "All Photos" : (CATEGORY_LABELS[cat] || cat)}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 animate-pulse">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <Folder className="w-10 h-10 text-muted-foreground opacity-50" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Gallery Update in Progress</h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                No images have been uploaded to the local gallery yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredImages.map((img) => (
                <div key={img.id} className="group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">{img.title}</h3>
                    {img.description && (
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{img.description}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium capitalize">
                        {CATEGORY_LABELS[img.category] || img.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(img.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Share Your Story</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Have photos from your therapy sessions or progress? Contact us to contribute to our gallery.
          </p>
        </div>
      </section>
    </main>
  )
}
