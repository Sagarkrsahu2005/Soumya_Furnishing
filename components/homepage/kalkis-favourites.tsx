"use client"

import React from "react"
import Link from "next/link"
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"
import { PRODUCTS } from "@/data/products"
import type { Product } from "@/lib/types"

type KalkiPick = {
  product: Product
  headline: string
  description: string
  category: string
  lifestyleImage: string
}

const kalkiSelections = [
  {
    slug: "dining-linen-napkins",
    headline: "Where Meals Become Memories",
    description: "Elegant tableware that makes every meal feel special",
    category: "Tablescape",
    lifestyleImage: "https://images.unsplash.com/photo-1515169273894-7e876dcf13da?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "heritage-indigo-cushion",
    headline: "Wrap Yourself in Comfort",
    description: "Premium comforters crafted for restful nights",
    category: "Comforters",
    lifestyleImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "bedroom-linen-sheets",
    headline: "Sleep in Luxury",
    description: "Breathe easy with soft, stylish bedsheets made for every season",
    category: "Bedsheets",
    lifestyleImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "wool-area-rug",
    headline: "Drape Your World in Elegance",
    description: "Premium fabrics that bring luxury and light control to your home",
    category: "Curtains",
    lifestyleImage: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "velvet-luxe-throw",
    headline: "Soft, breathable comfort",
    description: "Sustainable fabrics made from organic materials",
    category: "Premium Fabrics",
    lifestyleImage: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200&auto=format&fit=crop",
  },
]

const kalkiDeck: KalkiPick[] = kalkiSelections
  .map((selection) => {
    const product = PRODUCTS.find((item) => item.slug === selection.slug)
    if (!product) return null
    return {
      product,
      headline: selection.headline,
      description: selection.description,
      category: selection.category,
      lifestyleImage: selection.lifestyleImage,
    }
  })
  .filter((entry): entry is KalkiPick => Boolean(entry))

const beddingFilters = [
  "King Size",
  "King Fitted",
  "Double Size",
  "Double Fitted",
  "Single",
  "Single Fitted",
]

const DummyContent = ({ pick }: { pick: KalkiPick }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          {pick.headline}
        </span>{" "}
        {pick.description}
      </p>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-neutral-700 dark:text-neutral-200 mb-2">Product Details</h4>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            {pick.product.descriptionHtml || "Handcrafted with care using premium materials for lasting quality."}
          </p>
          {pick.product.materials && (
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">
              <span className="font-semibold">Materials:</span> {pick.product.materials.join(", ")}
            </p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-neutral-700 dark:text-neutral-200 mb-2">Care Instructions</h4>
          {pick.product.care && pick.product.care.length > 0 ? (
            <ul className="text-neutral-600 dark:text-neutral-400 text-sm list-disc list-inside">
              {pick.product.care.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Gentle care recommended. See product label for specific instructions.
            </p>
          )}
        </div>
      </div>
      <Link
        href={`/products/${pick.product.slug}`}
        className="mt-6 inline-flex items-center self-start rounded-full bg-[#623047] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition-colors hover:bg-[#2b1d24]"
      >
        Shop Now
      </Link>
    </div>
  )
}

export default function KalkisFavourites() {
  const cards = kalkiDeck.map((pick, index) => (
    <Card
      key={pick.product.id}
      card={{
        src: pick.lifestyleImage,
        title: pick.headline,
        category: pick.category,
        content: <DummyContent pick={pick} />,
      }}
      index={index}
    />
  ))

  return (
    <section className="bg-gradient-to-br from-[#f1f8f2] via-[#e8f5e9] to-[#dcedc8] py-20 md:py-28 px-4 md:px-8">
      <div className="w-full h-full">
        <div className="max-w-7xl mx-auto text-center space-y-5 mb-10">
          <p className="text-xs uppercase tracking-[0.5em] text-[#4A90E2]">Kalki&apos;s Favourite</p>
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-[#2b2b2b]">
            Living luxuries she reaches for first
          </h2>
          <p className="text-base md:text-lg text-[#5f5f5f] max-w-3xl mx-auto">
            A carousel of her current obsessions—from tables made for lingering brunches to beds draped in breathable layers.
          </p>
        </div>
        <Carousel items={cards} />
        
        <div className="mt-10 text-center">
          <h3 className="text-xl md:text-2xl font-semibold text-[#2b2b2b] mb-6">Bestselling Bedsheets</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {beddingFilters.map((filter) => (
              <button
                key={filter}
                className="rounded-full border border-[#e5e1da] bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#2b2b2b] transition-colors hover:bg-[#4A90E2] hover:border-[#4A90E2] hover:text-white"
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
