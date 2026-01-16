"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function AnalyticsPage() {
    const [views, setViews] = useState<any[]>([])
    const [totalViews, setTotalViews] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            // Get total count
            const { count } = await supabase.from("page_views").select("*", { count: "exact", head: true })
            setTotalViews(count || 0)

            // Get recent views (last 50)
            const { data } = await supabase
                .from("page_views")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(50)

            if (data) setViews(data)
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
                    <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Total Page Views</h3>
                        <p className="text-4xl font-bold text-gray-900 mt-2">{totalViews}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Views (Last 50)</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="space-y-3">
                            {views.map((v, i) => (
                                <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                                    <span className="text-gray-700 font-medium">{v.path || "/"}</span>
                                    <span className="text-gray-500">{new Date(v.created_at).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
