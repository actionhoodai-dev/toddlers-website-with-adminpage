"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center text-xs font-bold">
                TC
              </div>
              <h3 className="font-semibold">Toddlers</h3>
            </div>
            <p className="text-sm opacity-75">
              Comprehensive rehabilitation center for neurological and pediatric conditions since 2007.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/about" className="hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:opacity-100 transition-opacity">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:opacity-100 transition-opacity">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li className="flex items-start space-x-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div>9597744300</div>
                  <div>9865935809</div>
                  <div>9677638738</div>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:toddlersmstc@gmail.com" className="hover:opacity-100">
                  toddlersmstc@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold mb-4">Visit Us</h4>
            <div className="flex items-start space-x-2 text-sm opacity-75">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p>No.74, North Park street</p>
                <p>Gobichettipalayam</p>
                <p>Erode District, Pin: 638452</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-75">
            © 2026 Toddlers - Centre for Learning and Rehabilitation. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="opacity-75 hover:opacity-100 transition-opacity">
              <Facebook size={20} />
            </a>
            <a href="#" className="opacity-75 hover:opacity-100 transition-opacity">
              <Instagram size={20} />
            </a>
            <a href="#" className="opacity-75 hover:opacity-100 transition-opacity">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
