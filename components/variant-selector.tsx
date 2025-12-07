"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface VariantOption {
  id: string
  name: string
  options: Record<string, string>
}

interface VariantSelectorProps {
  variants?: VariantOption[]
  onSelectVariant?: (variantId: string, options: Record<string, string>) => void
}

export function VariantSelector({ variants, onSelectVariant }: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  if (!variants || variants.length === 0) return null

  const handleSelectOption = (key: string, value: string) => {
    const newOptions = { ...selectedOptions, [key]: value }
    setSelectedOptions(newOptions)
    onSelectVariant?.(variants[0]?.id || "", newOptions)
  }

  // Extract unique option names and values
  const optionKeys = Object.keys(variants[0]?.options || {})

  return (
    <div className="space-y-6">
      {optionKeys.map((key) => (
        <div key={key}>
          <label className="block text-sm font-semibold text-brand-charcoal mb-3 capitalize">{key}</label>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(variants.map((v) => v.options[key]))).map((value) => (
              <motion.button
                key={value}
                onClick={() => handleSelectOption(key, value)}
                className={`px-4 py-2 border-2 transition-all ${
                  selectedOptions[key] === value
                    ? "border-accent-gold bg-accent-gold/10 text-accent-gold font-semibold"
                    : "border-brand-sand text-brand-charcoal hover:border-accent-gold"
                }`}
                whileHover={{ scale: 1.05 }}
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
