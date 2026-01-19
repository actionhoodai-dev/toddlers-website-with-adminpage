"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src="/otf-logo.jpg"
                alt="Occupational Therapy Foundation"
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground leading-none hidden sm:inline text-lg">Toddlers</span>
            </div>
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

            <a
              href="tel:9597744300"
              className="hidden sm:inline-flex px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Call Us
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
              <div className="w-6 h-5 relative flex flex-col justify-center">
                <span
                  className={`absolute w-full h-0.5 bg-current transition-all duration-200 ${isOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-0"
                    }`}
                ></span>
                <span
                  className={`absolute w-full h-0.5 bg-current top-1/2 -translate-y-1/2 transition-all duration-200 ${isOpen ? "opacity-0" : "opacity-100"
                    }`}
                ></span>
                <span
                  className={`absolute w-full h-0.5 bg-current transition-all duration-200 ${isOpen ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-0"
                    }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="pb-4 space-y-1">
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

            <a
              href="tel:9597744300"
              className="block px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md text-center mt-2"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
