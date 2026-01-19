"use client"

const services = [
  {
    title: "Occupational therapy",
    description:
      "Occupational therapy helps individuals of all ages develop, maintain, or regain the skills needed for daily living and work.",
    image: "/service-occupational-therapy.jpg",
    details: [
      "Helps develop motor skills and hand-eye coordination",
      "Assists in improving self-care abilities",
      "Supports work-related skill development",
      "Addresses sensory processing issues",
      "Promotes independence and quality of life",
    ],
  },
  {
    title: "Physical therapy",
    description:
      "Physical therapy focuses on restoring mobility, strength, and function through evidence-based rehabilitation techniques.",
    image: "/service-physical-therapy.jpg",
    details: [
      "Improves muscle strength and flexibility",
      "Restores mobility and range of motion",
      "Reduces pain and inflammation",
      "Prevents further injury or disability",
      "Supports recovery after injury or surgery",
    ],
  },
  {
    title: "Special education",
    description:
      "Special education provides customized learning programs for children with developmental and cognitive challenges.",
    image: "/service-special-education.jpg",
    details: [
      "Personalized learning plans",
      "Small group and individual sessions",
      "Focus on academic and life skills",
      "Collaboration with families and therapists",
      "Continuous progress monitoring",
    ],
  },
  {
    title: "Speech therapy",
    description: "Speech therapy addresses communication and swallowing disorders with specialized interventions.",
    image: "/service-speech-therapy.jpg",
    details: [
      "Speech and language development",
      "Articulation and pronunciation improvement",
      "Voice and fluency enhancement",
      "Swallowing and feeding support",
      "Communication strategies and aids",
    ],
  },
]

export default function Services() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group animate-fade-in-up flex flex-col"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Service Image */}
                <div className="h-56 w-full overflow-hidden border-b border-border">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{service.description}</p>

                  <div className="mt-auto bg-muted/30 rounded-lg p-5 border border-border/50">
                    <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider opacity-80">Key Benefits</h4>
                    <ul className="space-y-3">
                      {service.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
