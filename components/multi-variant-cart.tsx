"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/components/toasts"
import type { Product } from "@/lib/types"
import Image from "next/image"

type ProductVariant = NonNullable<Product['variants']>[number]

interface VariantQuantity {
  [variantId: string]: number
}

interface MultiVariantCartProps {
  product: Product
  variants: ProductVariant[]
}

export function MultiVariantCart({ product, variants }: MultiVariantCartProps) {
  const [quantities, setQuantities] = useState<VariantQuantity>({})
  const { addItem } = useCart()
  const { addToast } = useToast()

  const updateQuantity = (variantId: string, change: number) => {
    setQuantities(prev => {
      const currentQty = prev[variantId] || 0
      const newQty = Math.max(0, currentQty + change)
      
      if (newQty === 0) {
        const { [variantId]: _, ...rest } = prev
        return rest
      }
      
      return { ...prev, [variantId]: newQty }
    })
  }

  const getVariantTotal = (variant: ProductVariant, quantity: number) => {
    const price = variant.price || product.price
    return price * quantity
  }

  const getTotalItems = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  }

  const getSubtotal = () => {
    return Object.entries(quantities).reduce((sum, [variantId, qty]) => {
      const variant = variants.find(v => v.id === variantId)
      if (!variant) return sum
      const price = variant.price || product.price
      return sum + (price * qty)
    }, 0)
  }

  const handleAddToCart = () => {
    const selectedVariants = Object.entries(quantities).filter(([_, qty]) => qty > 0)
    
    if (selectedVariants.length === 0) {
      addToast("Please select at least one variant", "error")
      return
    }

    // Add each variant with its quantity to cart
    selectedVariants.forEach(([variantId, quantity]) => {
      const variant = variants.find(v => v.id === variantId)
      if (variant) {
        for (let i = 0; i < quantity; i++) {
          // Add product with variant info stored separately
          addItem(product)
        }
      }
    })

    addToast(`${getTotalItems()} items added to cart`, "success")
    setQuantities({}) // Reset quantities after adding to cart
  }

  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 px-6 py-4 border-b border-white/10">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Select Variants
        </h3>
        <p className="text-sm text-gray-400 mt-1">Choose quantity for each variant you'd like to order</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0a0a0a] border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Variant
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                Variant Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {variants.map((variant, index) => {
                const quantity = quantities[variant.id] || 0
                const price = variant.price || product.price
                const comparePrice = variant.compareAtPrice || product.compareAtPrice
                const variantTotal = getVariantTotal(variant, quantity)
                const isOutOfStock = (variant.inventoryQuantity || 0) === 0

                return (
                  <motion.tr
                    key={variant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-white/5 transition-colors ${isOutOfStock ? 'opacity-50' : ''}`}
                  >
                    {/* Variant Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#2d2d2d] flex-shrink-0">
                            <Image
                              src={product.images[0].src}
                              alt={variant.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm line-clamp-2">
                            {Object.values(variant.options).join(" / ")}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {variant.sku || variant.name}
                          </p>
                          {isOutOfStock && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Quantity Controls */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(variant.id, -1)}
                          disabled={isOutOfStock || quantity === 0}
                          className="w-8 h-8 rounded-lg bg-[#2d2d2d] border border-white/10 flex items-center justify-center text-white hover:bg-[#3d3d3d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-12 text-center font-bold text-white text-lg">
                          {quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(variant.id, 1)}
                          disabled={isOutOfStock}
                          className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        {comparePrice && comparePrice > price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(comparePrice / 100)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-white">
                          {formatPrice(price / 100)}/ea
                        </span>
                      </div>
                    </td>

                    {/* Variant Total */}
                    <td className="px-6 py-4 text-right">
                      <motion.span
                        key={variantTotal}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-xl font-bold text-white"
                      >
                        {formatPrice(variantTotal / 100)}
                      </motion.span>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-[#0a0a0a] px-6 py-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total items</p>
              <p className="text-2xl font-bold text-white">{getTotalItems()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Product subtotal</p>
              <p className="text-2xl font-bold text-white">{formatPrice(getSubtotal() / 100)}</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={getTotalItems() === 0}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Add to Cart
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          Taxes included. Discounts and <span className="underline">shipping</span> calculated at checkout.
        </p>
      </div>
    </div>
  )
}
