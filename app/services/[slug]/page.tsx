import { db } from "@/lib/firebase/client"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ServiceDetailProps {
    params: Promise<{
        slug: string
    }>
}

export default async function ServiceDetail({ params }: ServiceDetailProps) {
    const { slug } = await params

    let service: any = null
    try {
        const q = query(
            collection(db, "services"),
            where("slug", "==", slug),
            limit(1)
        )
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
            service = {
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data()
            }
        }
    } catch (error) {
        console.error("Error fetching service detail:", error)
    }

    // 1. If not found
    // 2. If full_description is missing or empty (STRICT RULE)
    if (!service || !service.full_description || !service.full_description.trim()) {
        return notFound()
    }

    // Simple Markdown-like parser for the description
    const renderDescription = (text: string) => {
        return text.split('\n\n').map((block, index) => {
            if (block.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{block.replace('## ', '')}</h2>
            }
            if (block.startsWith('- ')) {
                const items = block.split('\n').map(item => item.replace('- ', '').trim())
                return (
                    <ul key={index} className="list-disc pl-5 space-y-2 mb-4">
                        {items.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                )
            }
            return <p key={index} className="mb-4 text-lg leading-relaxed">{block}</p>
        })
    }

    return (
        <main className="min-h-screen pt-16">
            {/* Header / Hero */}
            <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/services"
                        className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Services
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in-up">
                        {service.title}
                    </h1>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="max-w-3xl mx-auto">
                    {service.image_url && (
                        <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 border border-border">
                            <img
                                src={service.image_url}
                                alt={service.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none text-muted-foreground">
                        {renderDescription(service.full_description)}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 mt-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Interested in this service?</h2>
                    <p className="text-muted-foreground mb-8">
                        Contact us to learn more about how our {service.title.toLowerCase()} can help.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
                    >
                        Get in Touch
                    </Link>
                </div>
            </section>
        </main>
    )
}
