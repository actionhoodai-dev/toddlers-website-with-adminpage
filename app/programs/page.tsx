"use client"

import { Heart, Users, Brain, Zap } from "lucide-react"

const programs = [
  {
    title: "Developmental Delay",
    icon: <Brain className="w-8 h-8 text-primary" />,
    content: `Early identification and intervention are crucial for children with developmental delays. Our comprehensive assessment and therapy programs help identify areas of concern and provide targeted interventions to support optimal development.`,
  },
  {
    title: "Need of Occupational therapy",
    icon: <Zap className="w-8 h-8 text-accent" />,
    content: `Occupational therapy addresses the functional challenges individuals face in daily living. Whether it's fine motor skills, self-care abilities, or cognitive processing, our therapists work to improve independence and quality of life.`,
  },
  {
    title: "Assessment Focus",
    icon: <Users className="w-8 h-8 text-secondary" />,
    content: `Our assessment process is thorough and holistic, examining physical abilities, cognitive function, emotional well-being, and social skills. We focus on understanding each individual's unique strengths and challenges.`,
  },
  {
    title: "Early Intervention Center",
    icon: <Heart className="w-8 h-8 text-primary" />,
    content: `Early intervention services are designed for infants and young children who have developmental delays or disabilities. We work closely with families to provide services that support optimal development during critical periods.`,
  },
  {
    title: "Assessment",
    icon: <Brain className="w-8 h-8 text-accent" />,
    content: `Our comprehensive assessment includes standardized tests, clinical observations, and family interviews to gather detailed information about the individual's current functioning and potential areas for improvement.`,
  },
  {
    title: "Tests",
    icon: <Zap className="w-8 h-8 text-secondary" />,
    content: `We utilize evidence-based assessment tools and tests that are validated and reliable. These help us establish baseline function, track progress, and adjust treatment plans accordingly.`,
  },
  {
    title: "Diagnosis and Plan of Action",
    icon: <Heart className="w-8 h-8 text-primary" />,
    content: `After thorough assessment, we provide a clear diagnosis and develop a comprehensive plan of action tailored to the individual's specific needs, goals, and circumstances.`,
  },
  {
    title: "Discussion with family",
    icon: <Users className="w-8 h-8 text-accent" />,
    content: `Family involvement is essential to our approach. We discuss findings, recommendations, and goals with families to ensure understanding and cooperation in the rehabilitation process.`,
  },
  {
    title: "Further recommendations",
    icon: <Brain className="w-8 h-8 text-secondary" />,
    content: `Based on assessment results, we provide recommendations for ongoing therapy, education strategies, home programs, and any other services that may benefit the individual.`,
  },
  {
    title: "Remedial Therapy",
    icon: <Zap className="w-8 h-8 text-primary" />,
    content: `Remedial therapy focuses on addressing specific deficits and challenges. Our therapists use specialized techniques and interventions to help individuals overcome barriers to functioning.`,
  },
  {
    title: "Sessions with a Special Educator",
    icon: <Heart className="w-8 h-8 text-accent" />,
    content: `Our special educators work with individuals who have learning disabilities, developmental delays, or other challenges affecting academic progress. Sessions are tailored to individual learning styles and needs.`,
  },
  {
    title: "Customized plan of action",
    icon: <Users className="w-8 h-8 text-secondary" />,
    content: `Every individual receives a customized plan that reflects their unique profile, goals, and circumstances. Plans are flexible and adjusted based on progress and changing needs.`,
  },
  {
    title: "Family-centered care",
    icon: <Heart className="w-8 h-8 text-primary" />,
    content: `Our family-centered approach recognizes the importance of families in the rehabilitation process. We provide education, support, and resources to help families support their loved one's recovery and development.`,
  },
  {
    title: "Occupational Therapy",
    icon: <Zap className="w-8 h-8 text-accent" />,
    content: `Specialized occupational therapy services address the activities of daily living, work-related skills, and functional independence. We help individuals participate fully in meaningful activities.`,
  },
  {
    title: "Mental Health",
    icon: <Brain className="w-8 h-8 text-secondary" />,
    content: `Mental health support addresses psychological and emotional challenges. We provide counseling, coping strategies, and support for conditions such as depression, anxiety, and stress-related disorders.`,
  },
  {
    title: "Remedial Therapy Team",
    icon: <Users className="w-8 h-8 text-primary" />,
    content: `Our multidisciplinary remedial therapy team works collaboratively to address complex challenges. The team includes therapists, educators, counselors, and medical professionals.`,
  },
]

export default function Programs() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground animate-fade-in-up">Programs & Therapies</h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Comprehensive programs designed to support recovery and development
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/50 transition-all animate-fade-in-up hover:bg-gradient-to-br hover:from-card hover:to-primary/5 group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="mb-4 group-hover:scale-110 transition-transform">{program.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">{program.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{program.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule a consultation with our expert team to find the right program for you.
          </p>
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
