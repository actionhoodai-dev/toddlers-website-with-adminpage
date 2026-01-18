"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

interface ContactMessage {
    id: string
    name: string
    email: string
    phone: string | null
    message: string
    created_at: string
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false })

        if (data) setMessages(data)
        if (error) console.error("Error fetching messages:", error)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        const confirmed = confirm("Are you sure you want to delete this message? This cannot be undone.")
        if (!confirmed) return

        setDeleting(true)

        try {
            const { error } = await supabase
                .from("contact_messages")
                .delete()
                .eq("id", id)

            if (error) throw error

            alert("Message deleted successfully")
            setSelectedMessage(null)
            fetchMessages()
        } catch (error) {
            console.error("Delete error:", error)
            alert("Error deleting message. Please try again.")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
                        <p className="text-sm text-gray-600 mt-1">Total: {messages.length} messages</p>
                    </div>
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
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Message</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {messages.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                {new Date(msg.created_at).toLocaleDateString()}
                                                <br />
                                                <span className="text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{msg.name}</td>
                                            <td className="px-6 py-4">
                                                <a href={`mailto:${msg.email}`} className="text-teal-600 hover:underline">
                                                    {msg.email}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                {msg.phone ? (
                                                    <a href={`tel:${msg.phone}`} className="text-teal-600 hover:underline">
                                                        {msg.phone}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate">{msg.message}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => setSelectedMessage(msg)}
                                                        className="px-3 py-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition text-xs font-medium"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(msg.id)}
                                                        disabled={deleting}
                                                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-medium disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMessage(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Message Details</h2>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">From</label>
                                <p className="text-lg font-medium text-gray-900">{selectedMessage.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                                    <p className="text-gray-900">
                                        <a href={`mailto:${selectedMessage.email}`} className="text-teal-600 hover:underline">
                                            {selectedMessage.email}
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                                    <p className="text-gray-900">
                                        {selectedMessage.phone ? (
                                            <a href={`tel:${selectedMessage.phone}`} className="text-teal-600 hover:underline">
                                                {selectedMessage.phone}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">Not provided</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                                <p className="text-gray-900">
                                    {new Date(selectedMessage.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    {deleting ? "Deleting..." : "Delete Message"}
                                </button>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
