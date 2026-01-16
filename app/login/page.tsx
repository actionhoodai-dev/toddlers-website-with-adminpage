"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        // Basic validation
        if (!email || !password) {
            setError("Please enter both email and password")
            setLoading(false)
            return
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address")
            setLoading(false)
            return
        }

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            if (signInError) {
                // Handle specific error messages
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
                // Redirect to admin dashboard after successful login
                setTimeout(() => {
                    router.push("/admin")
                }, 1000)
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
            console.error("Login error:", err)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">
                        Sign in to access the admin dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                                <svg
                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                                <svg
                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm">{success}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Additional Links */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Test Credentials Info (Remove in production) */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 font-semibold mb-2">
                        🔐 Test Login Instructions:
                    </p>
                    <p className="text-xs text-blue-700">
                        Create a test user in Supabase Dashboard → Authentication → Users → Add User
                    </p>
                </div>
            </div>
        </div>
    )
}
