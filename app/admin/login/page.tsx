"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [configWarning, setConfigWarning] = useState<boolean>(false)

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!url || url.includes("example.supabase.co")) {
            setConfigWarning(true)
        }
    }, [])

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        if (!email || !password) {
            setError("Please enter both email and password")
            setLoading(false)
            return
        }

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            if (signInError) {
                if (signInError.message.includes("Invalid login credentials")) {
                    setError("Invalid email or password. Please try again.")
                } else if (signInError.message.includes("Email not confirmed")) {
                    setError("Please confirm your email address before logging in.")
                } else {
                    setError(signInError.message)
                }
                setLoading(false)
                return
            }

            if (data.user) {
                setSuccess("Login successful! Redirecting...")
                setTimeout(() => {
                    router.push("/admin")
                    router.refresh()
                }, 1000)
            }
        } catch (err: any) {
            if (err.message === "Failed to fetch") {
                setError("Network Error: Could not reach Supabase. This usually means the URL is invalid or blocked. Check your Vercel Environment Variables.")
            } else {
                setError("An unexpected error occurred.")
            }
            console.error(err)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 py-12">
            {configWarning && (
                <div className="bg-red-600 text-white p-4 rounded-lg mb-8 text-center animate-pulse shadow-lg font-bold">
                    ⚠️ SERVER CONFIGURATION ERROR: <br />
                    Missing Supabase URL or Key in Vercel settings. <br />
                    Please add them to Vercel and Redeploy.
                </div>
            )}
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h1>
                    <p className="text-gray-600">Secure sign in for administrators</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                                required
                            />
                        </div>
                        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
                        {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{success}</div>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-600 hover:text-teal-600">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
