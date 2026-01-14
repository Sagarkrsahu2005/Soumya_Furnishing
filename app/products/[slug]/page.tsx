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
import { motion, useScroll, useTransform } from "framer-motion"
import { Heart, Share2, Truck, Shield, RotateCcw, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCart(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      <Navbar />

      {/* Floating Add to Cart Box - Bottom Right */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: showStickyCart ? 0 : 100, opacity: showStickyCart ? 1 : 0 }}
        className="fixed bottom-6 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
              {product?.images[0] && (
                <img src={product.images[0].src} alt={product.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-stone-900 text-sm line-clamp-2">{product?.title}</h3>
              <p className="text-lg font-bold text-stone-900 mt-1">{product && formatPrice(product.price)}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => product && document.getElementById('main-add-to-cart')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Add to Cart
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pt-28 md:pt-32">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 text-sm text-stone-600"
        >
          <a href="/" className="hover:text-stone-900 transition-colors">Home</a>
          <span>/</span>
          {product?.category && (
            <>
              <a href={`/categories/${product.category.toLowerCase().replace(/ /g, '-')}`} className="hover:text-stone-900 transition-colors">
                {product.category}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-stone-900 font-medium">{product?.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <ProductGallery images={product.images} title={product.title} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-amber-900 text-xs font-bold tracking-wide uppercase">
                  Premium Collection
                </span>
              </div>
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-3 leading-tight">{product.title}</h1>
            {product.sku && <p className="text-sm text-stone-500 font-medium mb-4">SKU: {product.sku}</p>}

            {product.rating && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className={`text-xl ${i < Math.round(product.rating!) ? "text-amber-500" : "text-stone-300"}`}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <span className="text-sm text-stone-600 font-medium">
                  {formatRating(product.rating)} <span className="text-stone-400">({product.reviewsCount || 0} reviews)</span>
                </span>
              </div>
            )}

            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges.map((badge, i) => (
                  <motion.span
                    key={badge}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-500/20"
                  >
                    {badge}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Price Section */}
            <div className="mb-8 pb-8 border-b border-stone-200">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-4xl md:text-5xl font-bold text-stone-900">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-2xl text-stone-400 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <Truck className="w-4 h-4" />
                <p>Free shipping on orders above ₹2,000</p>
              </div>
            </div>

            {/* Material & Color Info */}
            {(product.materials || product.colors) && (
              <div className="mb-8 pb-8 border-b border-stone-200 space-y-4">
                {product.materials && (
                  <div>
                    <p className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">Material</p>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material) => (
                        <span key={material} className="px-3 py-1.5 bg-stone-100 text-stone-700 text-sm font-medium rounded-lg">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.colors && (
                  <div>
                    <p className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <span key={color} className="px-3 py-1.5 bg-stone-100 text-stone-700 text-sm font-medium rounded-lg capitalize">
                          {color.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <VariantSelector variants={product.variants} />
              </div>
            )}

            {/* Add to Cart Section */}
            <motion.div 
              id="main-add-to-cart"
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AddToCart product={product} />
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8 pb-8 border-b border-stone-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl transition-all duration-300 font-semibold text-sm ${
                  isWishlisted
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                    : "bg-white border-2 border-stone-200 text-stone-700 hover:border-stone-300 hover:shadow-md"
                }`}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border-2 border-stone-200 text-stone-700 hover:border-stone-300 hover:shadow-md transition-all duration-300 font-semibold text-sm"
              >
                <Share2 className="w-5 h-5" />
                Share
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">Free Shipping</p>
                  <p className="text-xs text-stone-600">Free delivery on orders above ₹2,000</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">30-Day Returns</p>
                  <p className="text-xs text-stone-600">Hassle-free returns within 30 days of purchase</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">Secure Payment</p>
                  <p className="text-xs text-stone-600">SSL encrypted checkout with multiple payment options</p>
                </div>
              </motion.div>
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
