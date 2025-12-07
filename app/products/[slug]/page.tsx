"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { VariantSelector } from "@/components/variant-selector"
import { AddToCart } from "@/components/add-to-cart"
import { ProductTabs } from "@/components/product-tabs"
import { PairWith } from "@/components/pair-with"
import { TrustBadges } from "@/components/trust-badges"
import type { Product } from "@/lib/types"
import { formatPrice, formatRating } from "@/lib/utils"
import { motion } from "framer-motion"
import { Heart, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (slug) {
      void fetch(`/api/products/${slug}`).then((r) => r.json()).then((p) => setProduct(p || null))
    }
  }, [slug])

  useEffect(() => {
    if (product) {
      void fetch(`/api/products`).then((r) => r.json()).then((all: Product[]) => {
        setRelatedProducts(all.filter((p) => p.room === product.room && p.id !== product.id).slice(0, 4))
      })
    }
  }, [product])

  if (!product) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-2xl text-brand-charcoal">Product not found</p>
        </div>
        <Footer />
      </main>
    )
  }

  const tabs = [
    {
      label: "Description",
      content: product.descriptionHtml || "A beautiful piece from our collection.",
    },
    {
      label: "Care & Fabric",
      content: product.care || ["Follow care instructions on tag"],
    },
    {
      label: "Reviews",
      content: `This product has ${product.reviewsCount || 0} reviews with a rating of ${formatRating(product.rating || 0)}`,
    },
  ]

  return (
    <main className="min-h-screen bg-brand-ivory">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <ProductGallery images={product.images} title={product.title} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-8 md:mb-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <span className="inline-block text-accent-gold text-xs font-bold tracking-widest uppercase">
                  Premium Collection
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-3 text-balance">{product.title}</h1>
              {product.sku && <p className="text-sm text-brand-charcoal/50 font-light">SKU: {product.sku}</p>}

              {product.rating && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < Math.round(product.rating!) ? "text-accent-gold" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-brand-charcoal/60">
                    {formatRating(product.rating)} ({product.reviewsCount || 0} reviews)
                  </span>
                </div>
              )}

              {product.badges && product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 bg-gradient-to-r from-accent-gold/10 to-accent-gold/5 text-accent-gold text-xs font-semibold rounded-full border border-accent-gold/20"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8 md:mb-10 pb-8 md:pb-10 border-b border-brand-sand/40">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-bold text-brand-charcoal">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-brand-charcoal/40 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="text-sm font-bold text-accent-gold ml-2">
                      Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-brand-charcoal/60">Free shipping on orders above ₹2000</p>
            </div>

            {(product.materials || product.colors) && (
              <div className="mb-8 md:mb-10 pb-8 md:pb-10 border-b border-brand-sand/40">
                {product.materials && (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-brand-charcoal mb-2 uppercase tracking-wider">Materials</p>
                    <p className="text-sm text-brand-charcoal/70 leading-relaxed">{product.materials.join(" • ")}</p>
                  </div>
                )}
                {product.colors && (
                  <div>
                    <p className="text-sm font-bold text-brand-charcoal mb-2 uppercase tracking-wider">Colors</p>
                    <p className="text-sm text-brand-charcoal/70 leading-relaxed">{product.colors.join(" • ")}</p>
                  </div>
                )}
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8 md:mb-10">
                <VariantSelector variants={product.variants} />
              </div>
            )}

            <div className="mb-8">
              <AddToCart product={product} />
            </div>

            <div className="flex gap-3 pb-8 md:pb-10 border-b border-brand-sand/40">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                  isWishlisted
                    ? "bg-gradient-to-r from-accent-gold to-accent-gold-light text-white shadow-elevated"
                    : "glass hover:shadow-hover"
                }`}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass hover:shadow-hover transition-all duration-300 font-semibold"
              >
                <Share2 className="w-5 h-5" />
                Share
              </motion.button>
            </div>

            <div className="mt-8">
              <TrustBadges />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <ProductTabs tabs={tabs} />
        </motion.div>

        {relatedProducts.length > 0 && <PairWith products={relatedProducts} title="Complete the Look" />}
      </div>

      <Footer />
    </main>
  )
}
