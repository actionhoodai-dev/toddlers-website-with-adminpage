"use client"

import { Users, Heart, Zap, Award } from "lucide-react"
import { useEffect, useState } from "react"

export default function About() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground animate-fade-in-up">About Toddlers</h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Transforming lives through comprehensive rehabilitation and care
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div
            className={`text-center p-8 bg-card rounded-lg border border-border transition-all duration-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Mission</h3>
            <p className="text-muted-foreground">
              Our mission is to provide acute care and rehabilitation services of international standards with recent
              advancements.
            </p>
          </div>

          <div
            className={`text-center p-8 bg-card rounded-lg border border-border transition-all duration-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Vision</h3>
            <p className="text-muted-foreground">
              Our goal is to provide a respectful, caring atmosphere where patients can advance both their health and
              the overall standard of living in our neighborhood.
            </p>
          </div>

          <div
            className={`text-center p-8 bg-card rounded-lg border border-border transition-all duration-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Aim</h3>
            <p className="text-muted-foreground">
              We aim to foster a context of mutual respect and care which will help patients improve their health and
              the general quality of our community life.
            </p>
          </div>
        </div>
      </section>

      {/* About Us Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-12 animate-fade-in-up ${isVisible ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold mb-6 text-foreground">About us</h2>
            <div className="prose prose-base max-w-none text-muted-foreground space-y-6">
              <p>
                Since 2007, as non-profit and non-governmental organization dedicated towards the upliftment of weaker
                section of the society together with differently abled, mentally ill, providing assistance to patients,
                poor and neglected, by empowering them through education & health-care.
              </p>

              <p>
                In our opinion every second chance starts with a first move. We assist you with that one. We are the
                first comprehensive and integrated rehabilitation center for patients with neurological and pediatric
                conditions in Tamilnadu.
              </p>

              <p>
                We prepare you to return to your home, to your job, and to the activities you enjoy. Through a
                cutting-edge care system, we seek to recover the highest level of independent functioning. Along with
                providing you with the tools you need for your new life, we also provide you with specialized
                occupational and physical training so you can get back to work.
              </p>

              <p>We are the step you would want to take from the hospital to your house.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`animate-fade-in-up ${isVisible ? "" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Our Journey</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Founded in 2007</h4>
                    <p className="text-sm text-muted-foreground">Started as a vision to serve the community</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">First Comprehensive Center</h4>
                    <p className="text-sm text-muted-foreground">Established in Tamilnadu for neurological care</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold text-sm">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">Multi-Discipline Approach</h4>
                    <p className="text-sm text-muted-foreground">Integrated therapies and education services</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className={`animate-fade-in-up ${isVisible ? "" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Why We're Different</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Award className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">International Standards</h4>
                    <p className="text-sm text-muted-foreground">Following global best practices</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Users className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Family-Centered Care</h4>
                    <p className="text-sm text-muted-foreground">Involving families in recovery</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Heart className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Compassionate Approach</h4>
                    <p className="text-sm text-muted-foreground">Treating every patient with dignity</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground animate-fade-in-up">Our Commitment to Excellence</h2>
          <p className="text-lg text-muted-foreground mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Our multi-disciplinary team of therapists, educators, and healthcare professionals is dedicated to providing
            personalized care for each patient. We combine clinical expertise with compassion to create a healing
            environment.
          </p>
        </div>
      </section>
    </main>
  )
}
