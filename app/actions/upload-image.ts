"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export async function uploadImage(formData: FormData) {
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string

    if (!file) return { error: "No file provided" }

    // DIAGNOSTIC CHECK: Environment Variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.error("Missing NEXT_PUBLIC_SUPABASE_URL")
        return { error: "Server Configuration Error: Missing Supabase URL. Please add NEXT_PUBLIC_SUPABASE_URL to Vercel Environment Variables." }
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
        return { error: "Server Configuration Error: Missing Service Role Key. Please add SUPABASE_SERVICE_ROLE_KEY to Vercel Environment Variables." }
    }

    try {
        // Initialize Admin Client (Bypass RLS and CORS)
        // Using Service Role Key is safe here in a Server Action
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        const fileExt = file.name.split(".").pop() || "jpg"
        const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        const fileName = `${Date.now()}_${safeTitle}.${fileExt}`

        // Convert File to Buffer for Supabase Upload in Node.js
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to 'gallery-images'
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from("gallery-images")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error("Server Storage Error:", uploadError)
            return { error: `Storage Error: ${uploadError.message}` }
        }

        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from("gallery-images")
            .getPublicUrl(fileName)

        // Insert to DB
        const { error: dbError } = await supabaseAdmin.from("gallery").insert({
            title,
            description,
            category,
            image_url: publicUrl,
            display_order: 0
        })

        if (dbError) {
            console.error("Server DB Error:", dbError)
            return { error: `Database Error: ${dbError.message}` }
        }

        revalidatePath("/admin")
        revalidatePath("/admin/gallery")
        revalidatePath("/gallery")

        return { success: true }

    } catch (error: any) {
        console.error("Server Action Panic:", error)
        return { error: error.message || "An unexpected server error occurred." }
    }
}
