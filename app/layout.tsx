import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#3fa896",
  interactiveWidget: "resizes-content",
}

export const metadata: Metadata = {
  title: "Toddlers - Centre for Learning and Rehabilitation",
  description:
    "Comprehensive therapy and rehabilitation center for neurological and pediatric conditions in Tamilnadu. Offering occupational therapy, physical therapy, speech therapy, and special education since 2007.",
  generator: "v0.app",
  keywords: [
    "rehabilitation center",
    "therapy",
    "occupational therapy",
    "physical therapy",
    "speech therapy",
    "special education",
    "Erode",
    "Tamilnadu",
    "neurological conditions",
    "autism",
    "cerebral palsy",
    "developmental delay",
  ],
  authors: [{ name: "Toddlers" }],
  creator: "Toddlers - Centre for Learning and Rehabilitation",
  publisher: "Toddlers",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://toddlers-rehab.com",
    siteName: "Toddlers - Centre for Learning and Rehabilitation",
    title: "Toddlers - Centre for Learning and Rehabilitation",
    description: "Comprehensive therapy and rehabilitation center for neurological and pediatric conditions",
    images: [
      {
        url: "https://toddlers-rehab.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Toddlers - Centre for Learning and Rehabilitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toddlers - Centre for Learning and Rehabilitation",
    description: "Comprehensive therapy and rehabilitation center",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} antialiased bg-background text-foreground`}>
        <ErrorBoundary>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
}
