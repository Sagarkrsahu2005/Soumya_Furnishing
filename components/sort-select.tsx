"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export type SortOption = "newest" | "price-asc" | "price-desc" | "featured"

interface SortSelectProps {
  onSortChange: (sort: SortOption) => void
}

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
]

export function SortSelect({ onSortChange }: SortSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<SortOption>("featured")

  const handleSelect = (value: SortOption) => {
    setSelected(value)
    onSortChange(value)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-sand text-sm font-medium text-brand-charcoal hover:bg-brand-ivory transition-colors"
      >
        {sortOptions.find((opt) => opt.value === selected)?.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-brand-sand shadow-lg z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                selected === option.value
                  ? "bg-brand-sage/30 text-accent-gold font-semibold"
                  : "text-brand-charcoal hover:bg-brand-sand/20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
