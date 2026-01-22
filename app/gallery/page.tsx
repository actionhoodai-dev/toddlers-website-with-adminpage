"use client"

import { Folder } from "lucide-react"

/**
 * Public Gallery Page - INTENTIONALLY DISABLED
 * 
 * This page displays an empty state because gallery functionality is disabled:
 * - No storage backend configured (Firebase Storage not used per requirements)
 * - Supabase Storage removed during production cleanup
 * - User-facing messaging explains the temporary unavailability
 * 
 * The page is fully responsive and maintains the site's design system.
 * DO NOT enable gallery without configuring a storage backend first.
 */

export default function Gallery() {
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

      {/* Gallery Section - Empty State for Storage Migration */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Folder className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Gallery Update in Progress</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Our gallery is currently being updated to bring you a better experience.
          </p>
          <div className="mt-8 p-4 bg-accent/5 rounded-lg border border-accent/10 inline-block">
            <p className="text-accent font-medium">“Gallery will be updated soon.”</p>
          </div>
        </div>
      </section>

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
