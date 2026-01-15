"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Loader2, Upload, X, Plus, Trash2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

interface ProductImage {
  id?: string
  src: string
  position?: number
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [images, setImages] = useState<ProductImage[]>([])
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    compareAtPrice: "",
    inventoryQuantity: "",
    status: "active",
    room: "",
    vendor: "",
    productType: "",
    tags: "",
  })

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data)
        setImages(data.images || [])
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          description: data.descriptionHtml || data.description || "",
          category: data.category || "",
          price: data.price?.toString() || "",
          compareAtPrice: data.compareAtPrice?.toString() || "",
          inventoryQuantity: data.variants?.[0]?.inventoryQuantity?.toString() || data.inventory?.toString() || "",
          status: data.status || "active",
          room: data.room || "",
          vendor: data.vendor || "",
          productType: data.productType || "",
          tags: data.tags || "",
        })
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        alert("Failed to load product")
        router.push("/admin/products")
      })
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          inventoryQuantity: formData.inventoryQuantity ? parseInt(formData.inventoryQuantity) : 0,
          images: images,
        }),
      })

      if (!response.ok) throw new Error("Failed to update product")

      alert("Product updated successfully!")
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUrlAdd = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      setImages([...images, { src: url, position: images.length }])
    }
  }

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleImageReorder = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < images.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
      setImages(newImages)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                placeholder="e.g., Premium Cotton Cushion Cover"
              />
            </div>

            {/* Slug */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                placeholder="premium-cotton-cushion-cover"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                placeholder="Detailed product description..."
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
              <button
                type="button"
                onClick={handleImageUrlAdd}
                className="flex items-center gap-2 text-[#7CB342] hover:text-[#558B2F] font-medium text-sm"
              >
                <Plus size={18} />
                Add Image URL
              </button>
            </div>

            {images.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <ImageIcon className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="text-gray-600 mb-3">No images added yet</p>
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="inline-flex items-center gap-2 bg-[#7CB342] text-white px-4 py-2 rounded-lg hover:bg-[#558B2F] transition-colors"
                >
                  <Plus size={18} />
                  Add First Image
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.src}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleImageReorder(index, 'up')}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100"
                          title="Move up"
                        >
                          ↑
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleImageReorder(index, 'down')}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100"
                          title="Move down"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-[#7CB342] text-white text-xs px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  placeholder="1999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare at Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  placeholder="2999"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column (1/3) */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  placeholder="Cushion Covers"
                />
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room
                </label>
                <select
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                >
                  <option value="">Select Room</option>
                  <option value="living-room">Living Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="dining">Dining</option>
                  <option value="kitchen">Kitchen</option>
                </select>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type
                </label>
                <input
                  type="text"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  placeholder="Home Decor"
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  placeholder="Soumya Furnishings"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  placeholder="cushion, cotton, premium"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.inventoryQuantity}
                onChange={(e) => setFormData({ ...formData, inventoryQuantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                placeholder="100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
              <Link
                href="/admin/products"
                className="w-full text-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
