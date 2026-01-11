"use client"

import { useState } from "react"

const allConditions = [
  "Autism",
  "Attention deficit hyperactivity disorder",
  "Dyslexia",
  "Developmental delay",
  "Cerebral palsy",
  "Intellectual disabilities",
  "Dysgraphia",
  "Dyscalculia",
  "Behavioural problems",
  "Adults",
  "Stroke",
  "Memory impairments",
  "Hand functions impairments",
  "Pain",
  "Stress",
  "Suicidal idea",
  "Depression",
  "Brain injury",
  "Schizophrenia",
  "Alcohol and Drug use disorders",
  "Addictions",
]

const categories = {
  Pediatric: [
    "Autism",
    "Attention deficit hyperactivity disorder",
    "Dyslexia",
    "Developmental delay",
    "Cerebral palsy",
    "Intellectual disabilities",
    "Dysgraphia",
    "Dyscalculia",
    "Behavioural problems",
  ],
  Adult: [
    "Stroke",
    "Memory impairments",
    "Hand functions impairments",
    "Pain",
    "Stress",
    "Suicidal idea",
    "Depression",
    "Brain injury",
    "Schizophrenia",
    "Alcohol and Drug use disorders",
    "Addictions",
  ],
}

export default function Conditions() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const displayedConditions = selectedCategory ? categories[selectedCategory as keyof typeof categories] : allConditions

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
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Conditions
          </button>
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedConditions.map((condition, index) => (
              <div
                key={condition}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-md transition-all hover:bg-gradient-to-br hover:from-card hover:to-primary/5 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <p className="font-medium text-foreground">{condition}</p>
              </div>
            ))}
          </div>
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
