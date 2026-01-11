"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })

      setTimeout(() => setSubmitted(false), 5000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground animate-fade-in-up">Get in Touch</h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            We're here to help. Reach out to us with any questions or to schedule a consultation.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {/* Phone */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/50 animate-fade-in-up">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Phone</h3>
            <p className="text-sm text-muted-foreground space-y-1">
              <div>
                <a href="tel:9597744300" className="hover:text-primary transition-colors">
                  9597744300
                </a>
              </div>
              <div>
                <a href="tel:9865935809" className="hover:text-primary transition-colors">
                  9865935809
                </a>
              </div>
              <div>
                <a href="tel:9677638738" className="hover:text-primary transition-colors">
                  9677638738
                </a>
              </div>
            </p>
          </div>

          {/* Email */}
          <div
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/50 animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Email</h3>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:toddlersmstc@gmail.com" className="hover:text-accent transition-colors">
                toddlersmstc@gmail.com
              </a>
            </p>
          </div>

          {/* Address */}
          <div
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/50 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Address</h3>
            <p className="text-sm text-muted-foreground">
              No.74, North Park street
              <br />
              Gobichettipalayam
              <br />
              Erode District, Pin: 638452
            </p>
          </div>

          {/* Hours */}
          <div
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/50 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Hours</h3>
            <p className="text-sm text-muted-foreground">
              Mon - Sat: 9:00 AM - 6:00 PM
              <br />
              Sun: Closed
              <br />
              Holidays: Closed
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Send us a Message</h2>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-lg p-8 space-y-6 animate-fade-in-up"
          >
            {submitted && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-primary text-sm">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="consultation">Schedule Consultation</option>
                  <option value="services">Inquire About Services</option>
                  <option value="programs">Learn About Programs</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Please tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : "Send Message"}
              {!loading && <MessageSquare size={20} />}
            </button>
          </form>
        </div>
      </section>

      {/* WhatsApp & Quick Contact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Quick Call</h3>
              <p className="text-muted-foreground mb-6">Need immediate assistance? Call us directly.</p>
              <a
                href="tel:9597744300"
                className="inline-flex px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                Call Now
              </a>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-foreground">WhatsApp</h3>
              <p className="text-muted-foreground mb-6">Connect with us on WhatsApp for quick responses.</p>
              <a
                href="https://wa.me/919597744300"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-all"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
