import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw error
    }

    return data
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        throw error
    }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error) {
        console.error("Error getting user:", error)
        return null
    }

    return user
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser()
    return !!user
}

/**
 * Get the current session
 */
export async function getSession() {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession()

    if (error) {
        console.error("Error getting session:", error)
        return null
    }

    return session
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
    callback: (event: string, session: any) => void
) {
    return supabase.auth.onAuthStateChange(callback)
}

/**
 * Create a new user (admin only - requires service role key)
 */
export async function createUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        throw error
    }

    return data
}
