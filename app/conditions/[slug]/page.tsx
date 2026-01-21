import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ConditionDetailProps {
    params: Promise<{
        slug: string
    }>
}

export default async function ConditionDetail({ params }: ConditionDetailProps) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: condition, error } = await supabase
        .from("clinical_conditions")
        .select("*")
        .eq("slug", slug)
        .single()

    // 1. If not found (DB error or no rows)
    // 2. If description is missing or empty (STRICT RULE)
    if (error || !condition || !condition.description || !condition.description.trim()) {
        return notFound()
    }

    // Simple Markdown-like parser for the description
    const renderDescription = (text: string) => {
        return text.split('\n\n').map((block, index) => {
            if (block.trim().startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{block.replace('## ', '')}</h2>
            }
            if (block.trim().startsWith('- ')) {
                const items = block.split('\n').map(item => item.replace('- ', '').trim()).filter(Boolean)
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
                        href="/conditions"
                        className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Conditions
                    </Link>
                    <div className="flex flex-col gap-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full w-fit">
                            {condition.category || "Clinical Condition"}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in-up">
                            {condition.name}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                        {renderDescription(condition.description)}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 mt-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Need help with {condition.name}?</h2>
                    <p className="text-muted-foreground mb-8">
                        Our experienced team is here to support you. Contact us for an assessment.
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
