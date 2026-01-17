import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
    const response = NextResponse.next()

    // Get the session token from cookies
    const accessToken = request.cookies.get("sb-access-token")?.value
    const refreshToken = request.cookies.get("sb-refresh-token")?.value

    // Create Supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let user = null

    // If we have tokens, try to get the user
    if (accessToken && refreshToken) {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser(accessToken)
            user = authUser
        } catch (error) {
            console.error("Auth error in middleware:", error)
        }
    }

    // Protect all /admin routes except /admin/login
    if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = "/admin/login"
            return NextResponse.redirect(url)
        }
    }

    // Redirect to /admin if already logged in and visiting /admin/login
    if (request.nextUrl.pathname.startsWith("/admin/login") && user) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
    }

    return response
}
