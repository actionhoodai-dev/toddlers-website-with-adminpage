"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase/client"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import Link from "next/link"

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string | null
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const q = query(collection(db, "services"), orderBy("display_order", "asc"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[]

      setServices(data || [])
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasDetailPage = (fullDescription: string | null) => {
    return fullDescription !== null && fullDescription.trim().length > 0
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading services...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground animate-fade-in-up">Our Services</h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Comprehensive, evidence-based therapies tailored to your unique needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const clickable = hasDetailPage(service.full_description)

                return (
                  <div
                    key={service.id}
                    className={`bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group animate-fade-in-up flex flex-col ${clickable ? "cursor-pointer" : ""
                      }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-6 text-lg leading-relaxed flex-1">
                        {service.short_description}
                      </p>

                      {clickable ? (
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all mt-auto"
                        >
                          Learn More →
                        </Link>
                      ) : (
                        <div className="text-sm text-muted-foreground italic mt-auto">
                          Detailed information coming soon
                        </div>
                      )}
                    </div>
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
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">Contact us to discuss which service is right for you.</p>
          <a
            href="/contact"
            className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
          >
            Schedule Consultation
          </a>
        </div>
      </section>
    </main>
  )
}
