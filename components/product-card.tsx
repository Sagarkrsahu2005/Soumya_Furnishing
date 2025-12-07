"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Heart, Eye } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden bg-brand-sand/20 aspect-square mb-4 rounded-2xl shadow-card hover:shadow-hover group-hover:shadow-elevated transition-all duration-500">
          <Image
            src={product.images[0]?.src || "/placeholder.svg?key=1q3mn"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {product.compareAtPrice && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 bg-gradient-to-r from-accent-gold to-accent-gold-light text-white px-4 py-2 text-xs font-bold rounded-full shadow-elevated"
            >
              Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 glass-premium flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full bg-white/90 backdrop-blur-sm text-brand-charcoal hover:bg-white transition-all shadow-elevated"
            >
              <Eye className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                setIsWishlisted(!isWishlisted)
              }}
              className={`p-4 rounded-full transition-all shadow-elevated ${
                isWishlisted ? "bg-accent-gold text-white" : "bg-white/90 text-brand-charcoal hover:bg-white"
              }`}
            >
              <Heart className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} />
            </motion.button>
          </motion.div>
        </div>
      </Link>

      <div className="space-y-2.5">
        <h3 className="text-sm md:text-base font-semibold text-brand-charcoal line-clamp-2 group-hover:text-accent-gold transition-colors duration-300">
          {product.title}
        </h3>

        {product.materials && (
          <p className="text-xs text-brand-charcoal/50 font-light tracking-wide">{product.materials.join(" • ")}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-brand-charcoal">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-brand-charcoal/40 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        {product.rating && (
          <div className="flex items-center gap-2 pt-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${i < Math.round(product.rating!) ? "text-accent-gold" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-brand-charcoal/50">({product.reviewsCount || 0})</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
