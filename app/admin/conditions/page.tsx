"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, X, ExternalLink } from "lucide-react"

interface ClinicalCondition {
    id: string
    name: string
    slug: string
    category: string | null
    description: string | null
    display_order: number
}

export default function ConditionsManagerPage() {
    const [conditions, setConditions] = useState<ClinicalCondition[]>([])
    const [loading, setLoading] = useState(true)
    const [editingCondition, setEditingCondition] = useState<ClinicalCondition | null>(null)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [filterCategory, setFilterCategory] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category: "Pediatric",
        description: "",
    })

    useEffect(() => {
        fetchConditions()
    }, [])

    const fetchConditions = async () => {
        const { data, error } = await supabase
            .from("clinical_conditions")
            .select("*")
            .order("display_order", { ascending: true })

        if (error) {
            console.error("Error fetching conditions:", error)
            alert("Failed to load conditions")
        } else {
            setConditions(data || [])
        }
        setLoading(false)
    }

    const handleAdd = () => {
        setIsAddingNew(true)
        setEditingCondition(null)
        setFormData({ name: "", slug: "", category: "Pediatric", description: "" })
    }

    const handleEdit = (condition: ClinicalCondition) => {
        setEditingCondition(condition)
        setIsAddingNew(false)
        setFormData({
            name: condition.name,
            slug: condition.slug,
            category: condition.category || "Pediatric",
            description: condition.description || "",
        })
    }

    const handleCancel = () => {
        setIsAddingNew(false)
        setEditingCondition(null)
        setFormData({ name: "", slug: "", category: "Pediatric", description: "" })
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const handleNameChange = (value: string) => {
        setFormData({ ...formData, name: value, slug: generateSlug(value) })
    }

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.slug.trim()) {
            alert("Please fill in all required fields (Name, Slug)")
            return
        }

        if (isAddingNew) {
            // Insert new condition
            const { error } = await supabase.from("clinical_conditions").insert({
                name: formData.name,
                slug: formData.slug,
                category: formData.category,
                description: formData.description.trim() || null,
                display_order: conditions.length + 1,
            })

            if (error) {
                console.error("Error adding condition:", error)
                alert("Failed to add condition. Slug might already exist.")
                return
            }
        } else if (editingCondition) {
            // Update existing condition
            const { error } = await supabase
                .from("clinical_conditions")
                .update({
                    name: formData.name,
                    slug: formData.slug,
                    category: formData.category,
                    description: formData.description.trim() || null,
                })
                .eq("id", editingCondition.id)

            if (error) {
                console.error("Error updating condition:", error)
                alert("Failed to update condition. Slug might already exist.")
                return
            }
        }

        handleCancel()
        fetchConditions()
    }

    const handleDelete = async (condition: ClinicalCondition) => {
        if (
            !confirm(
                `Are you sure you want to PERMANENTLY DELETE "${condition.name}"?\n\nThis action cannot be undone.`
            )
        ) {
            return
        }

        const { error } = await supabase.from("clinical_conditions").delete().eq("id", condition.id)

        if (error) {
            console.error("Error deleting condition:", error)
            alert("Failed to delete condition")
            return
        }

        fetchConditions()
    }

    const hasDetailPage = (description: string | null) => {
        return description !== null && description.trim().length > 0
    }

    const filteredConditions = filterCategory
        ? conditions.filter((c) => c.category === filterCategory)
        : conditions

    const pediatricCount = conditions.filter((c) => c.category === "Pediatric").length
    const adultCount = conditions.filter((c) => c.category === "Adult").length

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading conditions...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Clinical Conditions Manager</h1>
                    <p className="text-muted-foreground">Manage all clinical conditions displayed on the website</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Add Condition
                </button>
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingCondition) && (
                <div className="mb-8 bg-card border border-primary rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {isAddingNew ? "Add New Condition" : "Edit Condition"}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g., Autism"
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="autism"
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                            />
                            <p className="text-xs text-muted-foreground mt-1">URL-friendly version (auto-generated from name)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                            >
                                <option value="Pediatric">Pediatric</option>
                                <option value="Adult">Adult</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Description <span className="text-muted-foreground text-xs">(Optional - enables detail page)</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={6}
                                placeholder="Detailed description (supports markdown). If left empty, condition will NOT be clickable."
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                💡 <strong>Important:</strong> Condition will only have a detail page if this field contains text.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                            >
                                <Save size={18} />
                                {isAddingNew ? "Add Condition" : "Save Changes"}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setFilterCategory(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterCategory === null
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                >
                    All ({conditions.length})
                </button>
                <button
                    onClick={() => setFilterCategory("Pediatric")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterCategory === "Pediatric"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                >
                    Pediatric ({pediatricCount})
                </button>
                <button
                    onClick={() => setFilterCategory("Adult")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterCategory === "Adult"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                >
                    Adult ({adultCount})
                </button>
            </div>

            {/* Conditions List */}
            <div className="space-y-3">
                {filteredConditions.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 border border-border rounded-lg">
                        <p className="text-muted-foreground">No conditions in this category yet.</p>
                    </div>
                ) : (
                    filteredConditions.map((condition) => (
                        <div key={condition.id} className="bg-card border border-border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-foreground">{condition.name}</h3>
                                        <span className="px-2 py-1 bg-muted text-xs rounded-full">{condition.category}</span>
                                        {hasDetailPage(condition.description) ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                                                <ExternalLink size={12} />
                                                Has Detail Page
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                No Detail Page
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Slug: /{condition.slug}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(condition)}
                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(condition)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
