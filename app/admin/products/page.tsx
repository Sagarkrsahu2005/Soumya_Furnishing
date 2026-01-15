"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Edit, Trash2, Eye, Download, Upload, Filter, MoreVertical, CheckSquare, Square, Tags } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  title: string
  slug: string
  price: number
  compareAtPrice?: number
  images: { src: string }[]
  variants: any[]
  createdAt: string
  category?: string
  inventory?: number
  status?: string
  room?: string
  collections?: { collectionId: string; collection: { id: string; title: string } }[]
}

interface Collection {
  id: string
  title: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRoom, setFilterRoom] = useState("all")
  const [filterCollection, setFilterCollection] = useState("all")
  const [collections, setCollections] = useState<Collection[]>([])
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<Set<string>>(new Set())
  const [collectionAction, setCollectionAction] = useState<"add" | "remove">("add")
  const [collectionSearch, setCollectionSearch] = useState("")

  useEffect(() => {
    loadProducts()
    loadCollections()
  }, [])

  const loadProducts = () => {
    setLoading(true)
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }

  const loadCollections = () => {
    fetch("/api/collections")
      .then(r => r.json())
      .then(data => setCollections(data))
      .catch(err => console.error("Failed to load collections:", err))
  }

  const handleDelete = async (productId: string, productTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete product")

      // Reload products
      loadProducts()
    } catch (error) {
      console.error(error)
      alert("Failed to delete product")
    }
  }

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} product(s)? This action cannot be undone.`)) {
      return
    }

    try {
      await Promise.all(
        Array.from(selectedProducts).map(id =>
          fetch(`/api/admin/products/${id}`, { method: "DELETE" })
        )
      )
      setSelectedProducts(new Set())
      loadProducts()
      alert(`Successfully deleted ${selectedProducts.size} product(s)`)
    } catch (error) {
      console.error(error)
      alert("Failed to delete some products")
    }
  }

  // Bulk collection edit
  const handleBulkCollectionEdit = async () => {
    if (selectedProducts.size === 0 || selectedCollectionIds.size === 0) {
      alert("Please select products and at least one collection")
      return
    }

    try {
      const response = await fetch("/api/admin/products/bulk-collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: Array.from(selectedProducts),
          collectionIds: Array.from(selectedCollectionIds),
          action: collectionAction
        })
      })

      if (!response.ok) throw new Error("Failed to update collections")

      const result = await response.json()
      alert(`Successfully ${collectionAction === "add" ? "added to" : "removed from"} collections for ${selectedProducts.size} product(s)`)
      
      setShowCollectionModal(false)
      setSelectedCollectionIds(new Set())
      setSelectedProducts(new Set())
      loadProducts()
    } catch (error) {
      console.error(error)
      alert("Failed to update collections")
    }
  }

  // Export products
  const handleExport = () => {
    try {
      const selectedData = selectedProducts.size > 0
        ? products.filter(p => selectedProducts.has(p.id))
        : products

      if (selectedData.length === 0) {
        alert("No products to export")
        return
      }

      // Convert to CSV with variant details
      const headers = [
        "Product ID", 
        "Product Title", 
        "Slug", 
        "Category",
        "Room",
        "Product Price", 
        "Compare At Price",
        "Variant ID",
        "Variant Title",
        "Variant SKU",
        "Variant Price",
        "Variant Stock",
        "Status", 
        "Created At"
      ]
      
      const rows: string[] = []
      
      selectedData.forEach(product => {
        const title = (product.title || "").replace(/"/g, '""')
        const category = (product.category || "").replace(/,/g, ";")
        const productPrice = product.price || 0
        const compareAtPrice = product.compareAtPrice || ""
        const status = product.status || "active"
        const createdAt = product.createdAt ? new Date(product.createdAt).toISOString() : ""
        const room = (product.room || "").replace(/,/g, ";")
        
        // If product has variants, export each variant as a row
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach((variant: any) => {
            const variantTitle = (variant.title || "Default").replace(/"/g, '""')
            const variantSku = (variant.sku || "").replace(/,/g, ";")
            const variantPrice = variant.price || productPrice
            const variantStock = variant.inventoryQuantity || variant.inventory || 0
            
            rows.push([
              product.id || "",
              `"${title}"`,
              product.slug || "",
              category,
              room,
              productPrice,
              compareAtPrice,
              variant.id || "",
              `"${variantTitle}"`,
              variantSku,
              variantPrice,
              variantStock,
              status,
              createdAt
            ].join(","))
          })
        } else {
          // No variants, export product as single row
          rows.push([
            product.id || "",
            `"${title}"`,
            product.slug || "",
            category,
            room,
            productPrice,
            compareAtPrice,
            "",
            "Default",
            "",
            productPrice,
            product.inventory || 0,
            status,
            createdAt
          ].join(","))
        }
      })

      const csv = [headers.join(","), ...rows].join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `products-with-variants-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      const totalVariants = rows.length
      alert(`Successfully exported ${selectedData.length} product(s) with ${totalVariants} variant(s)`)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export products. Please try again.")
    }
  }

  // Toggle selection
  const toggleSelect = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  // Select all
  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
    }
  }

  // Filter and sort
  let filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === "all" || p.category === filterCategory
    const matchesStatus = filterStatus === "all" || (p.status || "active") === filterStatus
    const matchesRoom = filterRoom === "all" || p.room === filterRoom
    const matchesCollection = filterCollection === "all" || 
      (p.collections && p.collections.some(c => c.collectionId === filterCollection))
    return matchesSearch && matchesCategory && matchesStatus && matchesRoom && matchesCollection
  })

  // Sort
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "title-az":
        return a.title.localeCompare(b.title)
      case "title-za":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const rooms = Array.from(new Set(products.map(p => p.room).filter(Boolean)))

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            {products.length} total products • {filteredProducts.length} shown
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <Link
            href="/admin/products/import"
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
              />
            </div>
          </div>

          {/* Room Filter */}
          <div>
            <select
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
            >
              <option value="all">All Rooms</option>
              {rooms.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>

          {/* Collection Filter */}
          <div>
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
            >
              <option value="all">All Collections</option>
              {collections.map(col => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-az">Title: A-Z</option>
              <option value="title-za">Title: Z-A</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filterRoom !== "all" || filterCollection !== "all" || filterCategory !== "all" || search) && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-sm text-gray-600">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Search: "{search}"
                <button onClick={() => setSearch("")} className="hover:text-red-600">×</button>
              </span>
            )}
            {filterRoom !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Room: {filterRoom}
                <button onClick={() => setFilterRoom("all")} className="hover:text-red-600">×</button>
              </span>
            )}
            {filterCollection !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Collection: {collections.find(c => c.id === filterCollection)?.title}
                <button onClick={() => setFilterCollection("all")} className="hover:text-red-600">×</button>
              </span>
            )}
            {filterCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                Category: {filterCategory}
                <button onClick={() => setFilterCategory("all")} className="hover:text-red-600">×</button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("")
                setFilterRoom("all")
                setFilterCollection("all")
                setFilterCategory("all")
              }}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedProducts.size > 0 && (
        <div className="bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">{selectedProducts.size} product(s) selected</span>
            <button
              onClick={() => setSelectedProducts(new Set())}
              className="text-sm underline hover:no-underline"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={18} />
              Export Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 ? (
                      <CheckSquare size={20} />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7CB342]"></div>
                      <p>Loading products...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedProducts.has(product.id) ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelect(product.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {selectedProducts.has(product.id) ? (
                          <CheckSquare size={20} className="text-[#7CB342]" />
                        ) : (
                          <Square size={20} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <img
                            src={product.images[0].src}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                          {/* Collection Tags */}
                          {product.collections && product.collections.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.collections.slice(0, 2).map((col) => (
                                col.collection ? (
                                  <span
                                    key={col.collectionId}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {col.collection.title}
                                  </span>
                                ) : null
                              ))}
                              {product.collections.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                  +{product.collections.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="text-sm text-gray-600">{product.category || "—"}</span>
                        {product.room && (
                          <div className="text-xs text-gray-500">Room: {product.room}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">₹{product.price}</div>
                      {product.compareAtPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          ₹{product.compareAtPrice}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        (product.inventory || 0) < 10 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.inventory || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (product.status || "active") === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {product.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-gray-600 hover:text-[#7CB342] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-700">
        <p>
          Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span> of{" "}
          <span className="font-medium text-gray-900">{products.length}</span> products
        </p>
        {selectedProducts.size > 0 && (
          <p className="text-[#7CB342] font-medium">
            {selectedProducts.size} product(s) selected
          </p>
        )}
      </div>

      {/* Bulk Collection Edit Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white p-6">
              <h2 className="text-2xl font-bold">Edit Collections</h2>
              <p className="text-white/90 mt-1">{selectedProducts.size} product(s) selected</p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              {/* Action Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Action</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="add"
                      checked={collectionAction === "add"}
                      onChange={(e) => setCollectionAction(e.target.value as "add" | "remove")}
                      className="w-4 h-4 text-[#7CB342]"
                    />
                    <span className="text-gray-700">Add to Collections</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="remove"
                      checked={collectionAction === "remove"}
                      onChange={(e) => setCollectionAction(e.target.value as "add" | "remove")}
                      className="w-4 h-4 text-[#7CB342]"
                    />
                    <span className="text-gray-700">Remove from Collections</span>
                  </label>
                </div>
              </div>

              {/* Collections List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Collections ({collections.length} total)
                </label>
                
                {/* Search Collections */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={collectionSearch}
                    onChange={(e) => setCollectionSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => {
                      const filtered = collections.filter(c => 
                        c.title.toLowerCase().includes(collectionSearch.toLowerCase())
                      )
                      setSelectedCollectionIds(new Set(filtered.map(c => c.id)))
                    }}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    Select All Shown
                  </button>
                  <button
                    onClick={() => setSelectedCollectionIds(new Set())}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                  {collections.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No collections available</p>
                  ) : (
                    collections
                      .filter(c => c.title.toLowerCase().includes(collectionSearch.toLowerCase()))
                      .map((collection) => (
                        <label
                          key={collection.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedCollectionIds.has(collection.id)
                              ? "bg-[#7CB342]/10 border-2 border-[#7CB342]"
                              : "hover:bg-gray-50 border-2 border-transparent"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCollectionIds.has(collection.id)}
                            onChange={(e) => {
                              const newSet = new Set(selectedCollectionIds)
                              if (e.target.checked) {
                                newSet.add(collection.id)
                              } else {
                                newSet.delete(collection.id)
                              }
                              setSelectedCollectionIds(newSet)
                            }}
                            className="w-5 h-5 text-[#7CB342] rounded"
                          />
                          <span className="flex-1 font-medium text-gray-900">{collection.title}</span>
                          {selectedCollectionIds.has(collection.id) && (
                            <CheckSquare size={20} className="text-[#7CB342]" />
                          )}
                        </label>
                      ))
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedCollectionIds.size} collection(s) selected
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowCollectionModal(false)
                  setSelectedCollectionIds(new Set())
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkCollectionEdit}
                disabled={selectedCollectionIds.size === 0}
                className="px-6 py-2 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {collectionAction === "add" ? "Add to" : "Remove from"} Collections
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
