"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

export default function CuratedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Get 8 random featured products
        const shuffled = [...data].sort(() => 0.5 - Math.random())
        setProducts(shuffled.slice(0, 8))
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#f9fdf9] via-[#f1f8f2] to-[#e8f5e9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-[#4A90E2]">Curated for You</p>
              <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] leading-tight">
                Shop the Soumya edit
              </h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-[#e5e1da] bg-white p-4 animate-pulse">
                <div className="h-64 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#f9fdf9] via-[#f1f8f2] to-[#e8f5e9]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#4A90E2]">Curated for You</p>
            <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] leading-tight">
              Shop the Soumya edit
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs uppercase tracking-[0.3em] text-[#2b2b2b] border-b border-[#2b2b2b] w-fit hover:text-[#4A90E2] hover:border-[#4A90E2] transition-colors"
          >
            View all products
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group rounded-3xl border border-[#e5e1da] bg-white p-4 flex flex-col gap-4 hover:border-[#4A90E2]/60 hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden h-64">
                <Image
                  src={product.images[0]?.src || "/placeholder.svg"}
                  alt={product.images[0]?.alt || product.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {product.badges && product.badges.length > 0 && (
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.4em] text-white uppercase bg-black/50 px-2 py-1 rounded">
                    {product.badges[0]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-[#2b2b2b] text-lg font-playfair line-clamp-2">{product.title}</p>
                <p className="text-sm tracking-[0.3em] text-[#8c8c8c] uppercase">
                  {formatPrice(product.price, product.currency)}
                </p>
                {product.materials && product.materials.length > 0 && (
                  <p className="text-xs text-[#8c8c8c] tracking-[0.2em] uppercase">
                    {product.materials.join(" • ")}
                  </p>
                )}
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#2b2b2b] flex items-center gap-2">
                Shop Now
                <span className="h-px w-6 bg-[#2b2b2b]" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
