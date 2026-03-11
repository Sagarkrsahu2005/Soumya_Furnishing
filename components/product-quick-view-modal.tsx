"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Tag } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductQuickViewModalProps {
  product: Product | null
  variantId?: string
  isOpen: boolean
  onCloseAction: () => void
}

export function ProductQuickViewModal({ product, variantId, isOpen, onCloseAction }: ProductQuickViewModalProps) {
  if (!product) return null

  // Debug logging
  console.log('ProductQuickViewModal:', {
    productTitle: product.title,
    variantId: variantId,
    hasVariants: product.variants && product.variants.length > 0,
    variantsCount: product.variants?.length || 0,
    variantIds: product.variants?.map(v => v.id) || []
  })

  const variant = variantId ? product.variants?.find(v => v.id === variantId) : null
  const displayPrice = variant?.price || product.price
  const displayComparePrice = variant?.compareAtPrice || product.compareAtPrice

  // Parse variant options if available
  let variantOptions: Record<string, string> = {}
  if (variant && variant.options) {
    try {
      if (typeof variant.options === 'string') {
        variantOptions = JSON.parse(variant.options)
      } else if (typeof variant.options === 'object') {
        variantOptions = variant.options as Record<string, string>
      }
    } catch (e) {
      console.error('Failed to parse variant options:', e, variant.options)
    }
  }

  console.log('Variant found:', variant ? 'YES' : 'NO')
  console.log('Variant options:', variantOptions)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseAction}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onCloseAction}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8">
                <div className="flex gap-6">
                  {/* Left - Image */}
                  <div className="w-48 flex-shrink-0">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a1a] border-2 border-emerald-500/30">
                      <Image
                        src={product.images[0]?.src || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Right - Details */}
                  <div className="flex-1 space-y-6">
                    {/* Title */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {product.title}
                      </h2>
                      {product.sku && (
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-white">
                          {formatPrice(displayPrice / 100)}
                        </span>
                        {displayComparePrice && displayComparePrice > displayPrice && (
                          <>
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(displayComparePrice / 100)}
                            </span>
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              {Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Variant Details */}
                    {variant && (
                      <div className="space-y-3 p-5 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border-2 border-emerald-500/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                          <Tag className="w-5 h-5 text-emerald-400" />
                          <span className="text-base font-bold text-emerald-400 uppercase tracking-wider">Selected Variant</span>
                        </div>
                        
                        {/* Variant Options */}
                        {Object.keys(variantOptions).length > 0 ? (
                          <div className="space-y-3">
                            {Object.entries(variantOptions).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-lg border border-emerald-500/20">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider min-w-[70px]">
                                  {key}
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-transparent"></div>
                                <span className="text-base font-bold text-white">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-[#0a0a0a] rounded-lg border border-emerald-500/20">
                            <p className="text-sm font-bold text-white">{variant.name}</p>
                          </div>
                        )}

                        {/* Variant SKU */}
                        {variant.sku && (
                          <div className="pt-3 border-t border-white/20">
                            <p className="text-xs text-gray-400">Variant SKU: <span className="text-emerald-400 font-semibold">{variant.sku}</span></p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* No Variant Selected Message - Product has variants but none selected */}
                    {!variantId && product.variants && product.variants.length > 0 && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <p className="text-sm text-yellow-400 font-semibold mb-2">
                          ⚠️ No variant selected
                        </p>
                        <p className="text-xs text-gray-400">
                          This product has {product.variants.length} variant(s) available, but no specific variant was selected when adding to cart.
                        </p>
                      </div>
                    )}
                    
                    {/* Variant ID provided but not found - Error case */}
                    {variantId && !variant && product.variants && product.variants.length > 0 && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-sm text-red-400 font-semibold mb-2">
                          ❌ Variant not found
                        </p>
                        <p className="text-xs text-gray-400">
                          The selected variant (ID: {variantId}) could not be found among {product.variants.length} available variants.
                        </p>
                      </div>
                    )}
                    
                    {/* Product Without Variants */}
                    {(!product.variants || product.variants.length === 0) && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <p className="text-sm text-blue-400 font-semibold">
                          ℹ️ Standard Product (No Variants)
                        </p>
                      </div>
                    )}

                    {/* Stock Status */}
                    {variant?.inventoryQuantity !== undefined && (
                      <div className={`p-3 rounded-lg border ${
                        variant.inventoryQuantity > 0 
                          ? 'bg-emerald-500/10 border-emerald-500/20' 
                          : 'bg-red-500/10 border-red-500/20'
                      }`}>
                        <p className={`text-sm font-semibold ${
                          variant.inventoryQuantity > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {variant.inventoryQuantity > 0 
                            ? `${variant.inventoryQuantity} in stock` 
                            : 'Out of stock'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
