"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Heart, Eye, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group h-full relative"
    >
      {/* Glow Effect on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute -inset-0.5 bg-gradient-to-r from-[#4A90E2]/20 to-[#7CB342]/20 rounded-3xl blur-xl transition-opacity"
      />

      <div className="relative bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 group-hover:border-white/10 transition-all duration-500 h-full flex flex-col">
        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative">
          <div className="relative overflow-hidden aspect-[4/5] bg-[#1a1a1a]">
            <Image
              src={product.images[0]?.src || "/placeholder.svg?key=1q3mn"}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Discount Badge */}
            {product.compareAtPrice && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute top-3 right-3 z-10"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2] to-[#3A7BC8] rounded-full blur-md" />
                  <div className="relative px-3 py-1.5 bg-gradient-to-br from-[#4A90E2] to-[#3A7BC8] text-white text-xs font-bold rounded-full">
                    {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                  </div>
                </div>
              </motion.div>
            )}

            {/* Premium Badge */}
            {product.badges && product.badges.length > 0 && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-3 left-3 z-10"
              >
                <div className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-sm text-black text-xs font-bold rounded-full">
                  {product.badges[0]}
                </div>
              </motion.div>
            )}

            {/* Action Buttons Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault()
                  setIsWishlisted(!isWishlisted)
                }}
                className={`p-3 rounded-full backdrop-blur-xl border transition-all shadow-lg ${
                  isWishlisted 
                    ? "bg-[#4A90E2] border-[#4A90E2] text-white" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <Link href={`/products/${product.slug}`} className="block mb-auto">
            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-[#4A90E2] transition-colors duration-300 leading-snug">
              {product.title}
            </h3>

            {product.materials && (
              <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                {product.materials.join(" • ")}
              </p>
            )}
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < Math.round(product.rating!) ? "text-amber-400" : "text-gray-700"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {product.reviewsCount && (
                <span className="text-xs text-gray-600">({product.reviewsCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-gray-600 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
