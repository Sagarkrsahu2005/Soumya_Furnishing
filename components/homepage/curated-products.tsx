"use client"

import Image from "next/image"
import Link from "next/link"
import { PRODUCTS } from "@/data/products"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

const curatedSlugs = [
  "heritage-indigo-cushion",
  "velvet-luxe-throw",
  "wool-area-rug",
  "bedroom-linen-sheets",
  "silk-pillow-covers",
  "dining-linen-napkins",
  "table-runner-premium",
  "organic-weave-runner",
]

const curatedProducts: Product[] = curatedSlugs
  .map((slug) => PRODUCTS.find((product) => product.slug === slug))
  .filter((product): product is Product => Boolean(product))

export default function CuratedProducts() {
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
          {curatedProducts.map((product) => (
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
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.4em] text-white uppercase">
                  {product.badges?.[0] || "New"}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-[#2b2b2b] text-lg font-playfair">{product.title}</p>
                <p className="text-sm tracking-[0.3em] text-[#8c8c8c] uppercase">
                  {formatPrice(product.price, product.currency)}
                </p>
                {product.materials && (
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
