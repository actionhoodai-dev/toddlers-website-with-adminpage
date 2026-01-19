"use client"

import Link from "next/link"
import { ArrowRight, Heart, Stethoscope, Users, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="overflow-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Rehabilitation Center"
            className="w-full h-full object-cover"
          />
          {/* Lighter overlay to show image content while keeping text readable */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
          {/* Subtle gradient for depth, much lighter to reveal image */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/80"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Logo with Animation */}
          <div className="mb-8 flex justify-center animate-fade-in-up">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white/50 backdrop-blur-sm p-1">
              <img
                src="/otf-logo.jpg"
                alt="Occupational Therapy Foundation"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <div className="animate-hero-title" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-12">
              Toddlers – Centre for Learning and Rehabilitation
            </h1>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/contact"
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/50 backdrop-blur-sm text-foreground font-semibold rounded-lg hover:bg-white/70 transition-all border border-foreground/10"
            >
              Learn More
            </Link>
          </div>

          {/* Quick Stats */}
          <div
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">17+</div>
              <div className="text-xs text-muted-foreground font-medium">Years Serving</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-accent">4+</div>
              <div className="text-xs text-muted-foreground font-medium">Services</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-secondary">1000+</div>
              <div className="text-xs text-muted-foreground font-medium">Patients Helped</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 text-primary rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-white/30">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Our Services</h2>
            <p className="text-lg text-muted-foreground">Evidence-based therapies tailored to your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="group bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-all hover:border-primary/50 hover:bg-gradient-to-br hover:from-card hover:to-primary/5 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{service.name}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Explore All Services <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Clinical Conditions Preview Carousel */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Clinical Conditions We Treat</h2>
            <p className="text-lg text-muted-foreground">
              Expertise across pediatric and adult neurological conditions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {conditions.slice(0, 12).map((condition, i) => (
              <div
                key={condition}
                className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {condition}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/conditions"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All Conditions <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose Toddlers?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reasons.map((reason, i) => (
              <div key={i} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                    {reason.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Ready to Begin Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Contact us today to schedule a consultation with our expert team.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  )
}

const services = [
  {
    id: 1,
    name: "Occupational therapy",
    description: "Help patients develop, recover, and maintain the skills needed for daily living and work.",
    icon: <Stethoscope className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    name: "Physical therapy",
    description: "Restore mobility, strength, and function through evidence-based rehabilitation.",
    icon: <Heart className="w-6 h-6 text-accent" />,
  },
  {
    id: 3,
    name: "Speech therapy",
    description: "Address communication and swallowing disorders with specialized interventions.",
    icon: <Users className="w-6 h-6 text-secondary" />,
  },
  {
    id: 4,
    name: "Special education",
    description: "Customized learning programs for children with developmental and cognitive challenges.",
    icon: <Zap className="w-6 h-6 text-primary" />,
  },
]

const conditions = [
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

const reasons = [
  {
    title: "First Comprehensive Center",
    description:
      "The first comprehensive and integrated rehabilitation center for neurological and pediatric conditions in Tamilnadu.",
    icon: <Heart className="w-6 h-6 text-primary" />,
  },
  {
    title: "Expert Team",
    description: "Highly trained therapists and educators with years of experience in rehabilitation.",
    icon: <Users className="w-6 h-6 text-accent" />,
  },
  {
    title: "17 Years Experience",
    description: "Since 2007, dedicated to empowering patients and improving quality of life.",
    icon: <Zap className="w-6 h-6 text-secondary" />,
  },
  {
    title: "Family-Centered Care",
    description: "We involve families in every step of the rehabilitation journey for better outcomes.",
    icon: <Stethoscope className="w-6 h-6 text-primary" />,
  },
]
