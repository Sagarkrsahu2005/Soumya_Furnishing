"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Minus, ShoppingCart, Check } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/components/toasts"

interface AddToCartProps {
  product: Product
  variantId?: string
}

export function AddToCart({ product, variantId }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()
  const { addToast } = useToast()

  const handleAddToCart = () => {
    addItem(product, variantId, quantity)
    setIsAdded(true)
    addToast(`${product.title} added to cart!`, "success", 3000)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-brand-charcoal">Quantity:</span>
        <div className="flex items-center border-2 border-brand-sand">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 text-brand-charcoal hover:bg-brand-sand/30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-2 font-semibold text-brand-charcoal min-w-16 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 text-brand-charcoal hover:bg-brand-sand/30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <motion.button
        onClick={handleAddToCart}
        className={`w-full py-4 px-6 font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
          isAdded
            ? "bg-accent-gold text-white border-accent-gold"
            : "bg-accent-gold text-white border-accent-gold hover:bg-opacity-90"
        }`}
        whileHover={isAdded ? {} : { scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </motion.button>
    </div>
  )
}
