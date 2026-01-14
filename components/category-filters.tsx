"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X, SlidersHorizontal } from "lucide-react"

interface CategoryFiltersProps {
  availableMaterials: string[]
  availableColors: string[]
  availableRooms: string[]
  availableCategories?: string[]
  priceRange: { min: number; max: number }
  categorySlug?: string
  showCategoryFilter?: boolean
  currentSort?: string
  currentMinPrice?: number
  currentMaxPrice?: number
  currentMaterials?: string[]
  currentColors?: string[]
  currentRooms?: string[]
  currentCategories?: string[]
}

export function CategoryFilters({
  availableMaterials,
  availableColors,
  availableRooms,
  availableCategories = [],
  priceRange,
  categorySlug,
  showCategoryFilter = false,
  currentSort: propSort,
  currentMinPrice: propMinPrice,
  currentMaxPrice: propMaxPrice,
  currentMaterials: propMaterials,
  currentColors: propColors,
  currentRooms: propRooms,
  currentCategories: propCategories,
}: CategoryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    materials: true,
    colors: true,
    rooms: false,
    categories: showCategoryFilter,
    sort: true,
  })

  // Get current filter values from props or URL
  const currentMaterials = propMaterials || searchParams.get("materials")?.split(",") || []
  const currentColors = propColors || searchParams.get("colors")?.split(",") || []
  const currentRooms = propRooms || searchParams.get("room")?.split(",") || []
  const currentCategories = propCategories || searchParams.get("categories")?.split(",") || []
  const currentMinPrice = propMinPrice !== undefined ? String(propMinPrice) : searchParams.get("minPrice")
  const currentMaxPrice = propMaxPrice !== undefined ? String(propMaxPrice) : searchParams.get("maxPrice")
  const currentSort = propSort || searchParams.get("sort") || "newest"

  const [minPrice, setMinPrice] = useState(currentMinPrice || String(priceRange.min))
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice || String(priceRange.max))

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilters = (key: string, value: string | string[] | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      params.delete(key)
    } else if (Array.isArray(value)) {
      params.set(key, value.join(","))
    } else {
      params.set(key, value)
    }
    
    // Reset to page 1 when filters change
    params.delete("page")
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleArrayFilter = (key: string, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    
    updateFilters(key, newValues.length > 0 ? newValues : null)
  }

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (minPrice) params.set("minPrice", minPrice)
    else params.delete("minPrice")
    
    if (maxPrice) params.set("maxPrice", maxPrice)
    else params.delete("maxPrice")
    
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
    setMinPrice(String(priceRange.min))
    setMaxPrice(String(priceRange.max))
  }

  const activeFiltersCount = 
    currentMaterials.length + 
    currentColors.length + 
    currentRooms.length +
    currentCategories.length +
    (currentMinPrice || currentMaxPrice ? 1 : 0)

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ]

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string
    section: keyof typeof expandedSections
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left py-2"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            expandedSections[section] ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <X className="w-4 h-4" />
          Clear all filters ({activeFiltersCount})
        </button>
      )}

      {/* Sort */}
      <FilterSection title="Sort By" section="sort">
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={currentSort === option.value}
                onChange={(e) => updateFilters("sort", e.target.value)}
                className="w-4 h-4 text-[#7CB342] border-gray-300 focus:ring-[#7CB342]"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">Min</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder={String(priceRange.min)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">Max</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={String(priceRange.max)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full px-4 py-2 bg-[#7CB342] text-white rounded-lg text-sm font-medium hover:bg-[#558B2F] transition-colors"
          >
            Apply
          </button>
        </div>
      </FilterSection>

      {/* Materials */}
      {availableMaterials.length > 0 && (
        <FilterSection title="Material" section="materials">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableMaterials.slice(0, 20).map((material) => (
              <label key={material} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentMaterials.includes(material)}
                  onChange={() => toggleArrayFilter("materials", material, currentMaterials)}
                  className="w-4 h-4 text-[#7CB342] border-gray-300 rounded focus:ring-[#7CB342]"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                  {material.toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <FilterSection title="Color" section="colors">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableColors.slice(0, 20).map((color) => (
              <label key={color} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentColors.includes(color)}
                  onChange={() => toggleArrayFilter("colors", color, currentColors)}
                  className="w-4 h-4 text-[#7CB342] border-gray-300 rounded focus:ring-[#7CB342]"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                  {color.toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Rooms */}
      {availableRooms.length > 0 && (
        <FilterSection title="Room" section="rooms">
          <div className="space-y-2">
            {availableRooms.map((room) => (
              <label key={room} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentRooms.includes(room)}
                  onChange={() => toggleArrayFilter("room", room, currentRooms)}
                  className="w-4 h-4 text-[#7CB342] border-gray-300 rounded focus:ring-[#7CB342]"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {room}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Categories (for collection pages) */}
      {showCategoryFilter && availableCategories.length > 0 && (
        <FilterSection title="Category" section="categories">
          <div className="space-y-2">
            {availableCategories.map((category) => (
              <label key={category} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentCategories.includes(category)}
                  onChange={() => toggleArrayFilter("categories", category, currentCategories)}
                  className="w-4 h-4 text-[#7CB342] border-gray-300 rounded focus:ring-[#7CB342]"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 px-6 py-3 bg-[#7CB342] text-white rounded-full shadow-lg hover:bg-[#558B2F] transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-medium">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-white text-[#7CB342] rounded-full text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            {activeFiltersCount > 0 && (
              <span className="px-2.5 py-0.5 bg-[#7CB342] text-white rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <FilterContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
