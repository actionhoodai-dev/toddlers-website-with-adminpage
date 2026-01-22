import { auth } from "@/lib/firebase/client"
import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from "firebase/auth"

/**
 * Sign in with email and password using Firebase
 */
export async function signInWithEmail(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
        return userCredential.user
    } catch (error: any) {
        console.error("Firebase Sign In Error:", error)
        throw error
    }
}

/**
 * Sign out the current user using Firebase
 */
export async function signOut() {
    try {
        await firebaseSignOut(auth)
    } catch (error: any) {
        console.error("Firebase Sign Out Error:", error)
        throw error
    }
}

/**
 * Get the current authenticated user from Firebase
 */
export async function getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe()
            resolve(user)
        }, (error) => {
            console.error("Firebase Auth State Error:", error)
            resolve(null)
        })
    })
}

/**
 * Check if user is authenticated via Firebase
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser()
    return !!user
}

/**
 * Listen to auth state changes in Firebase
 */
export function onAuthStateChange(
    callback: (user: User | null) => void
) {
    return onAuthStateChanged(auth, callback)
}

/**
 * Firebase doesn't usually allow simple client-side signUp if it's restricted,
 * but this is kept for compatibility if needed.
 * Note: For admin creation, you'd usually use Admin SDK.
 */
export async function createUser(email: string, password: string) {
    // Note: This might fail if public signups are disabled in Firebase
    throw new Error("User creation should be done via Firebase Console or Admin SDK")
}
