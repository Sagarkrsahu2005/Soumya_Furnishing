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
    collections: [],
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

    // Collections filter
    if (filters.collections.length > 0) {
      results = results.filter((p) => 
        p.collections?.some((c: any) => filters.collections.includes(c.handle))
      )
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
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Elegant Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-16">
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-[#4A90E2]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#7CB342]/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <div className="w-2 h-2 rounded-full bg-[#4A90E2] animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.2em] text-gray-300 uppercase">Premium Collection</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent leading-tight">
              Curated for You
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8">
              Discover handcrafted furnishings that transform spaces into experiences
            </p>

            {/* Premium Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative max-w-xl mx-auto group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A90E2]/20 to-[#7CB342]/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#4A90E2] transition-colors" />
                <input
                  type="search"
                  placeholder="Search our collection..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-14 py-4 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4A90E2]/50 focus:bg-[#1a1a1a] transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Premium Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
                <FilterSidebar onFiltersChange={setFilters} />
              </div>
            </div>
          </motion.div>

          {/* Products Area */}
          <div className="lg:col-span-1">
            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5"
            >
              <div>
                <p className="text-sm text-gray-500 mb-1">Showing</p>
                <p className="text-lg font-semibold text-white">
                  {paginatedProducts.length} <span className="text-gray-600">of</span> {filteredProducts.length} <span className="text-gray-600">products</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Sort by</span>
                <SortSelect onSortChange={setSort} />
              </div>
            </motion.div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-lg text-gray-400 mb-3">Curating your collection...</p>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#4A90E2] to-[#7CB342] rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: '50%' }}
                  />
                </div>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      layout
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Elegant Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16"
                  >
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 px-4"
              >
                <div className="w-24 h-24 mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/20 to-[#7CB342]/20 rounded-full blur-2xl" />
                  <div className="relative w-full h-full rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No matches found</h3>
                <p className="text-gray-400 mb-8 text-center max-w-md">
                  We couldn't find any products matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      categories: [],
                      priceRange: [0, 100000],
                      materials: [],
                      rooms: [],
                      colors: [],
                      collections: [],
                    })
                    setSearchQuery("")
                  }}
                  className="group relative px-8 py-3.5 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] text-white rounded-xl font-medium overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7CB342] to-[#689F38] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    Reset All Filters
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
