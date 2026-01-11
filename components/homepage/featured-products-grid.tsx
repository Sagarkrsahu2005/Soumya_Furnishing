"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

export default function FeaturedProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Get 4 random products with badges
        const productsWithBadges = data.filter((p: Product) => p.badges && p.badges.length > 0)
        const shuffled = productsWithBadges.length >= 4 
          ? [...productsWithBadges].sort(() => 0.5 - Math.random()).slice(0, 4)
          : [...data].sort(() => 0.5 - Math.random()).slice(0, 4)
        setProducts(shuffled)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f2] to-[#f9fdf9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.4em] text-[#4A90E2] mb-4">Discover More</p>
            <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-[#2b2b2b] leading-tight">
              Handpicked for You
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-[#e5e1da] bg-white overflow-hidden animate-pulse">
                <div className="h-80 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f2] to-[#f9fdf9]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.4em] text-[#4A90E2] mb-4">Discover More</p>
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-[#2b2b2b] leading-tight">
            Handpicked for You
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group relative rounded-3xl border border-[#e5e1da] overflow-hidden hover:border-[#4A90E2] transition-all duration-500 hover:shadow-2xl hover:shadow-[#4A90E2]/10 bg-white"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={product.images[0]?.src || "/placeholder.svg"}
                  alt={product.images[0]?.alt || product.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {product.badges && product.badges[0] && (
                  <span className="absolute top-4 right-4 px-3 py-1 text-[10px] tracking-[0.3em] bg-white/90 backdrop-blur-sm text-[#2b2b2b] uppercase rounded-full">
                    {product.badges[0]}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="p-6 space-y-3 bg-white">
                <div>
                  <p className="text-[#2b2b2b] text-lg font-playfair leading-snug">{product.title}</p>
                  {product.materials && (
                    <p className="text-xs text-[#8c8c8c] tracking-[0.2em] uppercase mt-2">
                      {product.materials.slice(0, 2).join(" • ")}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm tracking-[0.3em] text-[#2b2b2b] font-semibold">
                    {formatPrice(product.price, product.currency)}
                  </p>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#c8b27c] flex items-center gap-2 group-hover:gap-3 transition-all">
                    View
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#2b2b2b] text-white text-xs uppercase tracking-[0.3em] hover:bg-[#4A90E2] transition-all duration-500 hover:scale-105 font-semibold"
          >
            Explore All Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
