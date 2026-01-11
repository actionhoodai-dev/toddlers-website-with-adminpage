"use client"

import { useState, useEffect } from "react"
import { Loader } from "lucide-react"

interface GalleryImage {
  id: string
  title: string
  description: string | null
  image_url: string
  created_at: string
  visible: boolean
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    // In production, this would fetch from Supabase
    // For now, we'll show the gallery structure
    setLoading(false)
  }, [])

  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground animate-fade-in-up">Gallery</h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Glimpses of our rehabilitation center and the impact we make
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative bg-muted rounded-lg overflow-hidden cursor-pointer h-full animate-fade-in-up hover:shadow-lg transition-all"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold">{image.title}</h3>
                      {image.description && <p className="text-white/80 text-sm">{image.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-card rounded-lg overflow-hidden max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image_url || "/placeholder.svg"}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[70vh] object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{selectedImage.title}</h2>
              {selectedImage.description && <p className="text-muted-foreground">{selectedImage.description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Message */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Share Your Story</h2>
          <p className="text-lg text-muted-foreground">
            Have photos from your therapy sessions or progress? Contact us to contribute to our gallery.
          </p>
        </div>
      </section>
    </main>
  )
}
