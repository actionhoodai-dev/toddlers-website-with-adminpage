"use server"

/**
 * Gallery Upload Action - INTENTIONALLY DISABLED
 * 
 * This function is disabled as per project requirements:
 * - No Firebase Storage integration (per client request)
 * - No Supabase Storage (removed during cleanup)
 * - Gallery feature is gracefully disabled with user-facing messaging
 * 
 * DO NOT enable storage uploads without explicit client approval.
 */

export async function uploadImage(formData: FormData) {
    return { error: "Image uploads are temporarily disabled. Storage setup pending." }
}
