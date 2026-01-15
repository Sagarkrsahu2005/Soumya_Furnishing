"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Search as SearchIcon } from "lucide-react"
import type { Room } from "@/lib/types"

interface FilterSidebarProps {
  onFiltersChange: (filters: FilterState) => void
  isMobile?: boolean
}

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  materials: string[]
  rooms: Room[]
  colors: string[]
  collections: string[]
}

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 100000],
  materials: [],
  rooms: [],
  colors: [],
  collections: [],
}

const rooms: Room[] = ["Living", "Bedroom", "Dining", "Outdoor"]
const materials = ["Cotton", "Linen", "Velvet", "Silk", "Wool", "Jute"]
const colors = ["Indigo", "Ivory", "Sage", "Charcoal", "Gold", "Terracotta"]

export function FilterSidebar({ onFiltersChange, isMobile }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [expandedSections, setExpandedSections] = useState<string[]>(["room", "material", "collections"])
  const [allCollections, setAllCollections] = useState<Array<{ id: string; title: string; handle: string }>>([])
  const [collectionSearch, setCollectionSearch] = useState("")

  useEffect(() => {
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => setAllCollections(data))
      .catch((err) => console.error("Failed to fetch collections:", err))
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const toggleFilter = (key: keyof Omit<FilterState, "priceRange">, value: string) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        [key]: (prev[key] as string[]).includes(value)
          ? (prev[key] as string[]).filter((item) => item !== value)
          : [...(prev[key] as string[]), value],
      }
      onFiltersChange(updated)
      return updated
    })
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-brand-charcoal">Filters</h3>
        <button onClick={resetFilters} className="text-sm text-accent-gold hover:text-brand-charcoal transition-colors">
          Reset
        </button>
      </div>

      {/* Room Filter */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("room")}
          className="flex items-center justify-between w-full pb-3 border-b border-brand-sand"
        >
          <h4 className="font-semibold text-brand-charcoal">Room</h4>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.includes("room") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.includes("room") && (
          <div className="space-y-2">
            {rooms.map((room) => (
              <label key={room} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.rooms.includes(room)}
                  onChange={() => toggleFilter("rooms", room)}
                  className="w-4 h-4 accent-accent-gold"
                />
                <span className="text-sm text-brand-charcoal">{room}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Material Filter */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("material")}
          className="flex items-center justify-between w-full pb-3 border-b border-brand-sand"
        >
          <h4 className="font-semibold text-brand-charcoal">Material</h4>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.includes("material") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.includes("material") && (
          <div className="space-y-2">
            {materials.map((material) => (
              <label key={material} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(material)}
                  onChange={() => toggleFilter("materials", material)}
                  className="w-4 h-4 accent-accent-gold"
                />
                <span className="text-sm text-brand-charcoal">{material}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("color")}
          className="flex items-center justify-between w-full pb-3 border-b border-brand-sand"
        >
          <h4 className="font-semibold text-brand-charcoal">Color</h4>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.includes("color") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.includes("color") && (
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => toggleFilter("colors", color)}
                className={`aspect-square rounded-full border-2 transition-all ${
                  filters.colors.includes(color) ? "border-accent-gold scale-110" : "border-brand-sand/30"
                }`}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Collections Filter */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("collections")}
          className="flex items-center justify-between w-full pb-3 border-b border-brand-sand"
        >
          <h4 className="font-semibold text-brand-charcoal">Collections ({allCollections.length})</h4>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.includes("collections") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.includes("collections") && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search collections..."
                value={collectionSearch}
                onChange={(e) => setCollectionSearch(e.target.value)}
                className="w-full px-3 py-2 pl-8 text-sm border border-brand-sand rounded focus:outline-none focus:border-accent-gold"
              />
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-charcoal/40" />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allCollections
                .filter((c) => c.title.toLowerCase().includes(collectionSearch.toLowerCase()))
                .map((collection) => (
                  <label key={collection.id} className="flex items-center gap-2 cursor-pointer hover:bg-brand-sand/20 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={filters.collections.includes(collection.handle)}
                      onChange={() => toggleFilter("collections", collection.handle)}
                      className="w-4 h-4 accent-accent-gold"
                    />
                    <span className="text-sm text-brand-charcoal">{collection.title}</span>
                  </label>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
