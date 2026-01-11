"use client"

import { useState, useMemo, useEffect } from "react"
import type { Product, Room } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { FilterSidebar, type FilterState } from "@/components/filter-sidebar"
import { SortSelect, type SortOption } from "@/components/sort-select"
import { Pagination } from "@/components/pagination"
// Fetch from API route to avoid bundling server-only code in client component
import { motion } from "framer-motion"
import { Search } from "lucide-react"

const PRODUCTS_PER_PAGE = 12

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 100000],
    materials: [],
    rooms: [],
    colors: [],
  })
  const [sort, setSort] = useState<SortOption>("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // fetch from API (DB or static fallback on server)
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        console.log("Fetched products:", data.length)
        setAllProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err)
        setLoading(false)
      })
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    console.log("Filtering products, total:", allProducts.length)
    let results = [...allProducts] as Product[]

    // Search filter
    if (searchQuery) {
      results = results.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter((p) => p.category && filters.categories.includes(p.category))
    }

    // Room filter
    if (filters.rooms.length > 0) {
      results = results.filter((p) => p.room && filters.rooms.includes(p.room as Room))
    }

    // Material filter
    if (filters.materials.length > 0) {
  results = results.filter((p) => p.materials?.some((m) => filters.materials.includes(m)))
    }

    // Color filter
    if (filters.colors.length > 0) {
  results = results.filter((p) => p.colors?.some((c) => filters.colors.includes(c)))
    }

    // Sort
    switch (sort) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        results.sort((a, b) => b.price - a.price)
        break
      case "newest":
        results.reverse()
        break
      default:
        break
    }

    console.log("Filtered results:", results.length)
    return results
  }, [allProducts, filters, sort, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  )

  return (
    <main className="min-h-screen bg-brand-ivory">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-6">Our Collection</h1>
          <p className="text-lg text-brand-charcoal/60 mb-6">Explore our curated selection of luxury furnishings</p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 pl-10 bg-white border border-brand-sand rounded text-brand-charcoal placeholder-brand-charcoal/50 focus:outline-none focus:border-accent-gold transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/40" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white p-6 rounded border border-brand-sand/30">
              <FilterSidebar onFiltersChange={setFilters} />
            </div>
          </motion.div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Sort & Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-between mb-8 pb-6 border-b border-brand-sand/30"
            >
              <p className="text-sm text-brand-charcoal/60">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
              <SortSelect onSortChange={setSort} />
            </motion.div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>

                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-brand-charcoal/60">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
