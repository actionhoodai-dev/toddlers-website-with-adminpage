import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"
import { getSiteSettingsServer, DEFAULT_CONTACT_INFO } from "@/lib/settings-server"

export async function Footer() {
  const settings = await getSiteSettingsServer()

  // Use database values or fallback to defaults
  const contactInfo = {
    address: settings?.address || DEFAULT_CONTACT_INFO.address,
    phone_primary: settings?.phone_primary || DEFAULT_CONTACT_INFO.phone_primary,
    phone_secondary: settings?.phone_secondary || DEFAULT_CONTACT_INFO.phone_secondary,
    phone_tertiary: settings?.phone_tertiary || DEFAULT_CONTACT_INFO.phone_tertiary,
    email: settings?.email || DEFAULT_CONTACT_INFO.email,
  }

  // Helper to format address for display
  const addressLines = contactInfo.address.split(',').map(line => line.trim())

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
                  {contactInfo.phone_primary && <div>{contactInfo.phone_primary}</div>}
                  {contactInfo.phone_secondary && <div>{contactInfo.phone_secondary}</div>}
                  {contactInfo.phone_tertiary && <div>{contactInfo.phone_tertiary}</div>}
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:opacity-100">
                  {contactInfo.email}
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
                {addressLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
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
