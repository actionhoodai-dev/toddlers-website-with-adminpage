"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase"

export default function SupabaseTestPage() {
    const [todos, setTodos] = useState<any[]>([])

    useEffect(() => {
        async function getTodos() {
            const { data: todos, error } = await supabase.from("todos").select()

            if (error) {
                console.error("Error fetching todos:", error)
                return
            }

            if (todos && todos.length > 0) {
                setTodos(todos)
            }
        }

        getTodos()
    }, [])

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
            {todos.length === 0 ? (
                <p>No todos found or loading...</p>
            ) : (
                <ul className="list-disc pl-5">
                    {todos.map((todo) => (
                        <li key={todo.id} className="mb-2">
                            {todo.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
