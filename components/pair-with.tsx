"use client"

import { motion } from "framer-motion"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface PairWithProps {
  products: Product[]
  title?: string
}

export function PairWith({ products, title = "Complete the Look" }: PairWithProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-12 md:mt-20 pt-12 md:pt-20 border-t border-brand-sand/30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8 md:mb-12"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal mb-2">{title}</h3>
        <p className="text-brand-charcoal/60">Items that pair beautifully with this product</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </section>
  )
}
