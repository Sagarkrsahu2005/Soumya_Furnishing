"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import { ChevronDown, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type Product = {
  id: string
  slug: string
  title: string
  price: number
  compareAtPrice?: number | null
  images: Array<{ src: string; alt?: string | null }>
  variants: Array<{ id: string; name: string; inventoryQuantity: number }>
  category?: string | null
  badges: string[]
  rating?: number | null
  reviewsCount?: number | null
}

type CollectionContentProps = {
  products: Product[]
  collectionTitle: string
}

export function CollectionContent({ products, collectionTitle }: CollectionContentProps) {
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Filter products based on availability
  const filteredProducts = useMemo(() => {
    if (availabilityFilter.length === 0) {
      return products
    }

    return products.filter((product) => {
      const totalStock = product.variants.reduce((sum, v) => sum + (v.inventoryQuantity || 0), 0)
      const isInStock = totalStock > 0

      if (availabilityFilter.includes("in-stock") && isInStock) return true
      if (availabilityFilter.includes("out-of-stock") && !isInStock) return true
      return false
    })
  }, [products, availabilityFilter])

  const toggleAvailability = (value: string) => {
    setAvailabilityFilter((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  const resetFilters = () => {
    setAvailabilityFilter([])
  }

  const hasActiveFilters = availabilityFilter.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div className="w-32 h-32 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/20 to-[#7CB342]/20 rounded-full blur-2xl" />
            <div className="relative w-full h-full rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Collection Coming Soon</h3>
          <p className="text-gray-400 mb-10 text-center max-w-md leading-relaxed">
            We're curating beautiful pieces for this collection. Check back soon for stunning new additions.
          </p>
          <Link
            href="/products"
            className="group relative px-8 py-3.5 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] text-white rounded-xl font-medium overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7CB342] to-[#689F38] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Explore All Products
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      ) : (
        <>
          {/* Filter/Sort Bar */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-10 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div>
                <p className="text-sm text-gray-500 mb-1">Showing</p>
                <p className="text-lg font-semibold text-white">
                  {filteredProducts.length} <span className="text-gray-600">of {products.length} {products.length === 1 ? 'piece' : 'pieces'}</span>
                </p>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden ml-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-[#4A90E2] text-white text-xs rounded-full">
                    {availabilityFilter.length}
                  </span>
                )}
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Availability Filter */}
              <div className="relative group">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white flex items-center gap-2 transition-colors">
                  Availability
                  {availabilityFilter.length > 0 && (
                    <span className="px-2 py-0.5 bg-[#4A90E2] text-white text-xs rounded-full">
                      {availabilityFilter.length}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-white">Availability</span>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="text-xs text-[#4A90E2] hover:text-[#7CB342] transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer group/item">
                        <input
                          type="checkbox"
                          checked={availabilityFilter.includes("in-stock")}
                          onChange={() => toggleAvailability("in-stock")}
                          className="w-4 h-4 rounded border-gray-600 bg-transparent checked:bg-[#4A90E2] checked:border-[#4A90E2] transition-colors"
                        />
                        <span className="text-sm text-gray-400 group-hover/item:text-white transition-colors">
                          In stock
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group/item">
                        <input
                          type="checkbox"
                          checked={availabilityFilter.includes("out-of-stock")}
                          onChange={() => toggleAvailability("out-of-stock")}
                          className="w-4 h-4 rounded border-gray-600 bg-transparent checked:bg-[#4A90E2] checked:border-[#4A90E2] transition-colors"
                        />
                        <span className="text-sm text-gray-400 group-hover/item:text-white transition-colors">
                          Out of stock
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={resetFilters}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2 transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden mb-8 overflow-hidden"
              >
                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-white">Availability</span>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-[#4A90E2] hover:text-[#7CB342] transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={availabilityFilter.includes("in-stock")}
                        onChange={() => toggleAvailability("in-stock")}
                        className="w-4 h-4 rounded border-gray-600 bg-transparent checked:bg-[#4A90E2] checked:border-[#4A90E2]"
                      />
                      <span className="text-sm text-gray-400">In stock</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={availabilityFilter.includes("out-of-stock")}
                        onChange={() => toggleAvailability("out-of-stock")}
                        className="w-4 h-4 rounded border-gray-600 bg-transparent checked:bg-[#4A90E2] checked:border-[#4A90E2]"
                      />
                      <span className="text-sm text-gray-400">Out of stock</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/20 to-[#7CB342]/20 rounded-full blur-2xl" />
                <div className="relative w-full h-full rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                Try adjusting your filters to find what you're looking for
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#4A90E2] hover:bg-[#7CB342] text-white rounded-xl font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Collection CTA */}
          {filteredProducts.length > 0 && (
            <div className="mt-20 pt-16 border-t border-white/5">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Looking for something specific?
                </h3>
                <p className="text-gray-400 mb-8">
                  Explore our complete catalog or get in touch for custom orders
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/products"
                    className="group px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      View All Products
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="group px-8 py-3.5 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] hover:from-[#7CB342] hover:to-[#689F38] text-white rounded-xl font-medium transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Contact Us
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
