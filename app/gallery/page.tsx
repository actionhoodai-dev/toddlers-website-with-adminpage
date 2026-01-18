"use client"

import { useState, useEffect } from "react"
import { Loader, X, Folder } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface GalleryImage {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string
  created_at: string
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("category", { ascending: true })
          .order("display_order", { ascending: true })

        if (error) throw error
        setImages(data || [])
      } catch (error: any) {
        console.error("Error fetching gallery:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Group images by category alphabetically
  const groupedImages = images.reduce((acc, image) => {
    const category = image.category || "uncategorized"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(image)
    return acc
  }, {} as Record<string, GalleryImage[]>)

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedImages).sort()

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

      {/* Gallery Grid - Grouped by Category */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Gallery images will be added soon.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back for updates!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {sortedCategories.map((category) => (
                <div key={category} className="animate-fade-in-up">
                  {/* Category Heading - No Count, No Emoji */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 capitalize flex items-center gap-3">
                    <Folder className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
                    {category}
                  </h2>

                  {/* Images Grid for this Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px] sm:auto-rows-[300px]">
                    {groupedImages[category].map((image) => (
                      <div
                        key={image.id}
                        className="group relative bg-muted rounded-lg overflow-hidden cursor-pointer h-full hover:shadow-lg transition-all"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image.image_url || "/placeholder.svg"}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div>
                            <h3 className="text-white font-semibold text-sm sm:text-base">{image.title}</h3>
                            {image.description && <p className="text-white/80 text-xs sm:text-sm">{image.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal with Close Button */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-card rounded-lg overflow-hidden max-w-3xl w-full relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Close image viewer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <img
              src={selectedImage.image_url || "/placeholder.svg"}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-cover"
            />
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{selectedImage.title}</h2>
              {selectedImage.description && <p className="text-sm sm:text-base text-muted-foreground">{selectedImage.description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Message */}
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
