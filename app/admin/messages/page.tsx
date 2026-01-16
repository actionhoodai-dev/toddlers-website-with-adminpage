"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMessages() {
            const { data, error } = await supabase
                .from("contact_messages")
                .select("*")
                .order("created_at", { ascending: false })

            if (data) setMessages(data)
            setLoading(false)
        }
        fetchMessages()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                    <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No messages found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Message</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {messages.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{msg.name}</td>
                                            <td className="px-6 py-4">{msg.email}</td>
                                            <td className="px-6 py-4 max-w-xs truncate">{msg.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
