# Toddlers - Centre for Learning and Rehabilitation

An award-level, enterprise-grade healthcare website for a therapy and rehabilitation center specializing in neurological and pediatric conditions.

## Overview

This website is built with Next.js 16, React 19, and Tailwind CSS v4, featuring:

- **World-class Design**: Healthcare-focused color palette with calm blues, muted greens, and warm off-whites
- **Smooth Animations**: Scroll-based reveals and micro-interactions using Framer Motion and CSS animations
- **Responsive Design**: Mobile-first approach that works seamlessly across all devices
- **SEO-Ready**: Full metadata, Open Graph tags, sitemaps, and robots.txt
- **Accessibility**: WCAG compliant with proper semantic HTML and ARIA attributes

## Pages

- **Home** (`/`) - Hero section with services preview and clinical conditions carousel
- **About** (`/about`) - Mission, vision, and center information
- **Services** (`/services`) - Detailed information about all four services offered
- **Clinical Conditions** (`/conditions`) - Comprehensive list of treatable conditions with filtering
- **Programs & Therapies** (`/programs`) - Detailed content about rehabilitation programs
- **Gallery** (`/gallery`) - Showcase of center activities
- **Contact** (`/contact`) - Contact form, location, hours, and direct communication options

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 with custom design system
- **Icons**: Lucide React
- **Components**: shadcn/ui
- **Analytics**: Vercel Analytics

### Backend
- **Database**: Firebase Firestore (for CMS content, settings, and contact messages)
- **Authentication**: Firebase Auth (admin panel authentication)
- **Analytics**: Firebase Analytics
- **Storage**: Not configured (Gallery feature currently disabled)

## Design System

### Color Palette
- **Primary**: Calm Teal/Green (`#3fa896`) - Trust and healing
- **Secondary**: Soft Blue (`#5eb3d6`) - Professional calm
- **Accent**: Warm Sage Green (`#5fa898`) - Approachable care
- **Muted**: Soft grays - Subtle elements
- **Background**: Warm off-whites - Welcoming feeling

### Typography
- **Font Family**: Geist (sans-serif) for all text
- **Headings**: Bold weights with generous line spacing
- **Body**: 16px minimum with 1.5 line height for readability

### Animations
- `fadeInUp` - Smooth entrance from below
- `slideInLeft/Right` - Directional emphasis
- `scaleIn` - Gentle appearance
- All with 300-600ms transitions for smooth feel

## Getting Started

### Installation

\`\`\`bash
# Clone or download the project
cd toddlers-website

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

### Installation

## Features

### ✅ Implemented
- Multi-page responsive website
- Hero section with animated background
- Services showcase with expandable details
- Clinical conditions with category filtering
- Comprehensive programs and therapies content
- Contact form with validation
- WhatsApp and direct call integration
- SEO optimization (metadata, sitemaps, robots.txt)
- Open Graph support for social sharing
- Accessibility features (WCAG compliant)
- Mobile navigation with hamburger menu
- Sticky navbar with scroll detection
- Smooth scroll animations and reveals

### ✅ Integrated Backend Features
- Firebase Firestore for dynamic CMS content
- Firebase Authentication for admin panel
- Contact form with Firebase Firestore storage
- Admin dashboard for content management

### 🚧 Intentionally Disabled
- Gallery uploads (no storage backend configured)
- Firebase Storage (not used per requirements)

## File Structure

\`\`\`
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Home page
├── globals.css             # Global styles & design tokens
├── about/page.tsx          # About page
├── services/page.tsx       # Services page
├── conditions/page.tsx     # Clinical conditions page
├── programs/page.tsx       # Programs & therapies page
├── gallery/page.tsx        # Gallery showcase
├── contact/page.tsx        # Contact page
├── not-found.tsx          # 404 page
├── robots.ts              # SEO robots.txt
├── sitemap.ts             # XML sitemap
└── opengraph-image.tsx    # OG image generator

components/
├── navbar.tsx             # Main navigation
├── footer.tsx             # Footer with info
└── scroll-reveal.tsx      # Scroll animation component

hooks/
└── use-scroll-position.ts # Scroll position tracking
\`\`\`

## Deployment

### Vercel (Recommended)

\`\`\`bash
# Connect your GitHub repo to Vercel
# Push to main branch to auto-deploy
```

### Environment Variables

Create a `.env.local` file for local development:

```env
# Firebase Configuration (Primary backend)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# NOTE: Firebase Storage is NOT used for gallery uploads
# Gallery feature is currently disabled - no storage backend configured
```

## Customization

### Update Center Information

Edit these files with your actual information:
- `components/navbar.tsx` - Change phone numbers
- `components/footer.tsx` - Update address and contact details
- `app/contact/page.tsx` - Modify contact info and hours
- `app/layout.tsx` - Update metadata

### Modify Design

Edit `app/globals.css` to customize:
- Color palette (OKLch values)
- Typography
- Border radius
- Animation timings

### Add New Pages

1. Create folder: `app/your-page/`
2. Create file: `app/your-page/page.tsx`
3. Add route to navbar in `components/navbar.tsx`
4. Update sitemap in `app/sitemap.ts`

## Performance

- **Lighthouse Scores**: Optimized for Core Web Vitals
- **Image Optimization**: Next.js Image component ready
- **CSS-in-JS**: Tailwind for minimal runtime overhead
- **Code Splitting**: Automatic route-based splitting
- **Animations**: GPU-accelerated transforms

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Color contrast compliance (WCAG AA)
- ✅ Screen reader friendly
- ✅ Skip to main content link
- ✅ Focus indicators
- ✅ Form error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Private - Toddlers Centre for Learning and Rehabilitation

## Support

For questions or issues:
- 📞 Phone: 9597744300 / 9865935809 / 9677638738
- 📧 Email: toddlersmstc@gmail.com
- 📍 Address: No.74, North Park street, Gobichettipalayam, Erode District, Pin: 638452

---

**Built with ❤️ for comprehensive rehabilitation care**
