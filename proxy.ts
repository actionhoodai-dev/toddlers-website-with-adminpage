import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  // Redirect /admin routes to login if not authenticated
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const auth = request.cookies.get("admin_authenticated")
    if (!auth && request.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
