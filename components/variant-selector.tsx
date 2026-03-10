"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface VariantOption {
  id: string
  name: string
  options: Record<string, string>
  price?: number
}

interface VariantSelectorProps {
  variants?: VariantOption[]
  onSelectVariant?: (variantId: string) => void
}

export function VariantSelector({ variants, onSelectVariant }: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  if (!variants || variants.length === 0) return null

  const handleSelectOption = (key: string, value: string) => {
    const newOptions = { ...selectedOptions, [key]: value }
    setSelectedOptions(newOptions)
    
    // Find the matching variant
    const matchingVariant = variants.find(v => {
      return Object.keys(newOptions).every(optKey => 
        v.options[optKey] === newOptions[optKey]
      )
    })
    
    if (matchingVariant && onSelectVariant) {
      onSelectVariant(matchingVariant.id)
    }
  }

  // Extract unique option names and values
  const optionKeys = Object.keys(variants[0]?.options || {})

  return (
    <div className="space-y-6">
      {optionKeys.map((key) => (
        <div key={key}>
          <label className="block text-sm font-bold text-white mb-3 capitalize tracking-wider uppercase">{key}</label>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(variants.map((v) => v.options[key]))).map((value) => (
              <motion.button
                key={value}
                onClick={() => handleSelectOption(key, value)}
                className={`px-4 py-2.5 border-2 rounded-lg transition-all font-medium ${
                  selectedOptions[key] === value
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20"
                    : "border-white/10 bg-[#2d2d2d] text-gray-300 hover:border-emerald-500/50 hover:bg-[#3d3d3d]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {value}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
