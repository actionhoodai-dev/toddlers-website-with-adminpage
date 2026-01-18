import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const title = formData.get("title") as string
        const category = formData.get("category") as string
        const description = formData.get("description") as string

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: "Server Configuration Error: Missing Supabase Credentials" }, { status: 500 })
        }

        // Connect to Supabase with Service Key (Bypass RLS)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        // Check site settings before upload
        const { data: settings, error: settingsError } = await supabaseAdmin
            .from("site_settings")
            .select("*")
            .single()

        if (settingsError) {
            console.error("Settings fetch error:", settingsError)
            return NextResponse.json({ error: "Unable to verify site settings" }, { status: 500 })
        }

        // Check if gallery is enabled
        if (!settings.gallery_enabled) {
            return NextResponse.json({
                error: "Gallery uploads are currently disabled. Please contact the administrator."
            }, { status: 403 })
        }

        // Check current image count against max limit
        const { count: currentCount, error: countError } = await supabaseAdmin
            .from("gallery")
            .select("*", { count: "exact", head: true })

        if (countError) {
            console.error("Count query error:", countError)
            return NextResponse.json({ error: "Unable to verify image count" }, { status: 500 })
        }

        if (currentCount && currentCount >= settings.max_gallery_images) {
            return NextResponse.json({
                error: `Gallery is full. Maximum ${settings.max_gallery_images} images allowed. Please delete some images before uploading.`
            }, { status: 403 })
        }

        const fileExt = file.name.split(".").pop() || "jpg"
        const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        const fileName = `${Date.now()}_${safeTitle}.${fileExt}`

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload
        console.log("Starting Storage Upload:", fileName)
        const { error: uploadError } = await supabaseAdmin.storage
            .from("gallery-images")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error("API Storage Error Details:", uploadError)
            return NextResponse.json({ error: `Storage Error: ${uploadError.message}` }, { status: 500 })
        }
        console.log("Storage Upload Success")

        // Get URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from("gallery-images")
            .getPublicUrl(fileName)

        console.log("Public URL generated:", publicUrl)

        // DB Insert
        const { error: dbError } = await supabaseAdmin.from("gallery").insert({
            title,
            description,
            category,
            image_url: publicUrl,
            display_order: 0
        })

        if (dbError) {
            console.error("API Database Error Details:", dbError)
            return NextResponse.json({ error: `Database Error: ${dbError.message}` }, { status: 500 })
        }

        console.log("Database Insert Success")

        return NextResponse.json({ success: true, url: publicUrl })
    } catch (error: any) {
        console.error("API Catch Error:", error)
        return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 })
    }
}
