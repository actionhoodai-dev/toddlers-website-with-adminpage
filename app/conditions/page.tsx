"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase/client"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import Link from "next/link"

interface Condition {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
}

export default function Conditions() {
  const [conditions, setConditions] = useState<Condition[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get unique categories from data
  const categories = Array.from(new Set(conditions.map(c => c.category).filter(Boolean))) as string[]

  useEffect(() => {
    fetchConditions()
  }, [])

  const fetchConditions = async () => {
    try {
      const q = query(collection(db, "conditions"), orderBy("display_order", "asc"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Condition[]

      setConditions(data || [])
    } catch (error) {
      console.error("Error fetching conditions:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasDetailPage = (description: string | null) => {
    return description !== null && description.trim().length > 0
  }

  const displayedConditions = selectedCategory
    ? conditions.filter(c => c.category === selectedCategory)
    : conditions

  if (loading) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading conditions...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground animate-fade-in-up">Clinical Conditions We Treat</h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Expertise across pediatric and adult neurological conditions
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            All Conditions
          </button>

          {/* Static buttons if API fails, otherwise dynamic could be better but sticking to plan structure */}
          <button
            onClick={() => setSelectedCategory("Pediatric")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedCategory === "Pediatric"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            Pediatric
          </button>

          <button
            onClick={() => setSelectedCategory("Adult")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedCategory === "Adult"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            Adult
          </button>
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          {displayedConditions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No conditions found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedConditions.map((condition, index) => {
                const clickable = hasDetailPage(condition.description)

                return (
                  <div
                    key={condition.id}
                    className={`bg-card border border-border rounded-lg p-6 animate-fade-in-up flex items-center justify-between group ${clickable
                      ? "hover:border-primary/50 hover:shadow-md transition-all hover:bg-gradient-to-br hover:from-card hover:to-primary/5 cursor-pointer"
                      : ""
                      }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {clickable ? (
                      <Link href={`/conditions/${condition.slug}`} className="w-full flex items-center justify-between">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {condition.name}
                        </span>
                        <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Details →
                        </span>
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {condition.name}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Don't See Your Condition?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Contact us to discuss your specific needs. Our expert team can help with many conditions beyond this list.
          </p>
          <a
            href="/contact"
            className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </main>
  )
}
