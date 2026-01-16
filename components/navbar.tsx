"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Clinical Conditions", href: "/conditions" },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm border-b border-border" : "bg-background"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">TC</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">Toddlers</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted/50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button + Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="hidden md:inline-flex px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-md hover:from-teal-600 hover:to-teal-700 transition-all shadow-sm"
            >
              Admin Login
            </Link>
            <a
              href="tel:9597744300"
              className="hidden sm:inline-flex px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Call Us
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-1 animate-fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded-md"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-md text-center hover:from-teal-600 hover:to-teal-700 transition-all"
            >
              Admin Login
            </Link>
            <a
              href="tel:9597744300"
              className="block px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md text-center"
            >
              Call Us
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
