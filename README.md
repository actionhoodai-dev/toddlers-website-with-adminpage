# Toddlers - Centre for Learning and Rehabilitation

An award-level, enterprise-grade healthcare website for a therapy and rehabilitation center specializing in neurological and pediatric conditions.

## Overview

This website is built with Next.js 16, React 19, and Tailwind CSS v4, featuring:

- **World-class Design**: Healthcare-focused color palette with calm blues, muted greens, and warm off-whites
- **Smooth Animations**: Scroll-based reveals and micro-interactions using Framer Motion and CSS animations
- **Responsive Design**: Mobile-first approach that works seamlessly across all devices
- **SEO-Ready**: Full metadata, Open Graph tags, sitemaps, and robots.txt
- **Admin Dashboard**: Secure gallery management system with Supabase integration ready
- **Accessibility**: WCAG compliant with proper semantic HTML and ARIA attributes

## Pages

- **Home** (`/`) - Hero section with services preview and clinical conditions carousel
- **About** (`/about`) - Mission, vision, and center information
- **Services** (`/services`) - Detailed information about all four services offered
- **Clinical Conditions** (`/conditions`) - Comprehensive list of treatable conditions with filtering
- **Programs & Therapies** (`/programs`) - Detailed content about rehabilitation programs
- **Gallery** (`/gallery`) - Showcase of center activities (admin-controlled)
- **Contact** (`/contact`) - Contact form, location, hours, and direct communication options
- **Admin Login** (`/admin/login`) - Secure admin authentication
- **Admin Dashboard** (`/admin`) - Gallery and content management
- **Gallery Admin** (`/admin/gallery`) - Upload, manage, and reorder images

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 with custom design system
- **Icons**: Lucide React
- **Components**: shadcn/ui
- **Analytics**: Vercel Analytics

### Backend Ready
- **Database**: Supabase (configured but with local fallbacks)
- **Authentication**: Supabase Auth (admin only)
- **Storage**: Supabase Storage (for gallery images)

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

```bash
# Clone or download the project
cd toddlers-website

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Demo Credentials

**Admin Access:**
- Email: `admin@toddlers.com`
- Password: `secure_password_123`

Navigate to `/admin/login` to access the admin dashboard.

## Features

### ✅ Implemented
- Multi-page responsive website
- Hero section with animated background
- Services showcase with expandable details
- Clinical conditions with category filtering
- Comprehensive programs and therapies content
- Contact form with validation
- WhatsApp and direct call integration
- Admin authentication system
- Gallery management UI (ready for Supabase)
- SEO optimization (metadata, sitemaps, robots.txt)
- Open Graph support for social sharing
- Accessibility features (WCAG compliant)
- Mobile navigation with hamburger menu
- Sticky navbar with scroll detection
- Smooth scroll animations and reveals

### 🔄 Ready for Integration
- Supabase Database for gallery metadata
- Supabase Storage for image uploads
- Supabase Auth for admin authentication
- Email notifications for contact form
- CMS integration for content management

## File Structure

```
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
├── admin/
│   ├── page.tsx           # Admin dashboard
│   ├── login/page.tsx     # Admin login
│   └── gallery/page.tsx   # Gallery management
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
```

## Deployment

### Vercel (Recommended)

```bash
# Connect your GitHub repo to Vercel
# Push to main branch to auto-deploy
```

### Environment Variables

Create a `.env.local` file for local development:

```env
# For Supabase integration (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
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
