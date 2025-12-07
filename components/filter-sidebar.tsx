"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
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
}

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 100000],
  materials: [],
  rooms: [],
  colors: [],
}

const rooms: Room[] = ["Living", "Bedroom", "Dining", "Outdoor"]
const materials = ["Cotton", "Linen", "Velvet", "Silk", "Wool", "Jute"]
const colors = ["Indigo", "Ivory", "Sage", "Charcoal", "Gold", "Terracotta"]

export function FilterSidebar({ onFiltersChange, isMobile }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [expandedSections, setExpandedSections] = useState<string[]>(["room", "material"])

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
    </div>
  )
}
