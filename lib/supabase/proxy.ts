import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateProxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    if (!envUrl || !envKey) {
        console.error("PROXY ERROR: Supabase environment variables are missing!")
    }

    const supabaseUrl = (envUrl && envUrl.startsWith("http")) ? envUrl : "https://example.supabase.co"
    const supabaseKey = (envKey && envKey.length > 0) ? envKey : "example-key"

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // IMPORTANT: You *must* call getUser to refresh the auth token!
    const { data: { user } } = await supabase.auth.getUser()

    // Protect all /admin routes except /admin/login
    if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = "/admin/login"
            return NextResponse.redirect(url)
        }
    }

    // Redirect logic removed as per user request
    // "THE PAGE SHOULD NT REDIRECT TO ADMIN PAGE WHEN IM LOGIN"
    /*
    if (request.nextUrl.pathname.startsWith("/admin/login") && user) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
    }
    */

    return response
}
