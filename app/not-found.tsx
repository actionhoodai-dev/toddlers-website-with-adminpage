import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center pt-16">
      <div className="text-center px-4 animate-fade-in-up">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-2xl text-muted-foreground mb-4">Page Not Found</p>
        <p className="text-lg text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          Return Home
        </Link>
      </div>
    </main>
  )
}
