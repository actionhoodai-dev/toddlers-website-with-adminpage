"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase/client"
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, where, limit, serverTimestamp } from "firebase/firestore"
import { Plus, Edit, Trash2, Save, X, ExternalLink } from "lucide-react"

interface Service {
    id: string
    title: string
    slug: string
    short_description: string
    full_description: string | null
    display_order: number
}

export default function ServicesManagerPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        short_description: "",
        full_description: "",
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            const q = query(collection(db, "services"), orderBy("display_order", "asc"))
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Service[]
            setServices(data || [])
        } catch (error) {
            console.error("Error fetching services:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setIsAddingNew(true)
        setEditingService(null)
        setFormData({ title: "", slug: "", short_description: "", full_description: "" })
    }

    const handleEdit = (service: Service) => {
        setEditingService(service)
        setIsAddingNew(false)
        setFormData({
            title: service.title,
            slug: service.slug,
            short_description: service.short_description,
            full_description: service.full_description || "",
        })
    }

    const handleCancel = () => {
        setIsAddingNew(false)
        setEditingService(null)
        setFormData({ title: "", slug: "", short_description: "", full_description: "" })
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const handleTitleChange = (value: string) => {
        setFormData({ ...formData, title: value, slug: generateSlug(value) })
    }

    const checkSlugUniqueness = async (slug: string, excludeId?: string) => {
        const q = query(collection(db, "services"), where("slug", "==", slug), limit(1))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) return true

        // If it exists, check if it's the same document we are editing
        return querySnapshot.docs[0].id === excludeId
    }

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.slug.trim() || !formData.short_description.trim()) {
            alert("Please fill in all required fields (Title, Slug, Short Description)")
            return
        }

        const isSlugUnique = await checkSlugUniqueness(formData.slug, editingService?.id)
        if (!isSlugUnique) {
            alert("A service with this slug already exists. Please choose a different title or slug.")
            return
        }

        try {
            if (isAddingNew) {
                // Insert new service
                await addDoc(collection(db, "services"), {
                    title: formData.title,
                    slug: formData.slug,
                    short_description: formData.short_description,
                    full_description: formData.full_description.trim() || null,
                    display_order: services.length + 1,
                    created_at: serverTimestamp()
                })
            } else if (editingService) {
                // Update existing service
                const serviceRef = doc(db, "services", editingService.id)
                await updateDoc(serviceRef, {
                    title: formData.title,
                    slug: formData.slug,
                    short_description: formData.short_description,
                    full_description: formData.full_description.trim() || null,
                    updated_at: serverTimestamp()
                })
            }

            handleCancel()
            fetchServices()
        } catch (error) {
            console.error("Error saving service:", error)
            alert("Failed to save service. Please try again.")
        }
    }

    const handleDelete = async (service: Service) => {
        if (
            !confirm(
                `Are you sure you want to PERMANENTLY DELETE "${service.title}"?\n\nThis action cannot be undone.`
            )
        ) {
            return
        }

        try {
            await deleteDoc(doc(db, "services", service.id))
            fetchServices()
        } catch (error) {
            console.error("Error deleting service:", error)
            alert("Failed to delete service")
        }
    }

    const hasDetailPage = (fullDescription: string | null) => {
        return fullDescription !== null && fullDescription.trim().length > 0
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading services...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Services Manager</h1>
                    <p className="text-muted-foreground">Manage all services displayed on the website</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Add Service
                </button>
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingService) && (
                <div className="mb-8 bg-card border border-primary rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">{isAddingNew ? "Add New Service" : "Edit Service"}</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="e.g., Occupational therapy"
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
                                placeholder="occupational-therapy"
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                            />
                            <p className="text-xs text-muted-foreground mt-1">URL-friendly version (auto-generated from title)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Short Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.short_description}
                                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                rows={3}
                                placeholder="Brief description shown on service cards"
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Full Description <span className="text-muted-foreground text-xs">(Optional - enables detail page)</span>
                            </label>
                            <textarea
                                value={formData.full_description}
                                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                rows={8}
                                placeholder="Detailed description (supports markdown). If left empty, service card will NOT be clickable."
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                💡 <strong>Important:</strong> Service will only have a detail page if this field contains text.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                            >
                                <Save size={18} />
                                {isAddingNew ? "Add Service" : "Save Changes"}
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

            {/* Services List */}
            <div className="space-y-4">
                {services.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 border border-border rounded-lg">
                        <p className="text-muted-foreground">No services yet. Click "Add Service" to create one.</p>
                    </div>
                ) : (
                    services.map((service) => (
                        <div key={service.id} className="bg-card border border-border rounded-lg p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                                        {hasDetailPage(service.full_description) ? (
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
                                    <p className="text-sm text-muted-foreground mb-2">Slug: /{service.slug}</p>
                                    <p className="text-muted-foreground">{service.short_description}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service)}
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
