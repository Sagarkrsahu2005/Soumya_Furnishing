"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const collections = [
  {
    id: "1",
    title: "Heritage Indigo",
    blurb: "Traditional natural dyes meet contemporary design",
    image: "indigo-fabric-textile-natural-dye",
    handle: "heritage-indigo",
  },
  {
    id: "2",
    title: "Velvet Luxe",
    blurb: "Sumptuous velvet in rich, sophisticated hues",
    image: "luxury-velvet-cushions-gold-accents",
    handle: "velvet-luxe",
  },
  {
    id: "3",
    title: "Organic Weaves",
    blurb: "Sustainable materials for the conscious home",
    image: "organic-cotton-linen-weave-natural",
    handle: "organic-weaves",
  },
]

export function CollectionsCarousel() {
  const [current, setCurrent] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % collections.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoplay])

  const goToSlide = (index: number) => {
    setCurrent(index)
    setIsAutoplay(false)
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % collections.length)
    setIsAutoplay(false)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + collections.length) % collections.length)
    setIsAutoplay(false)
  }

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-brand-ivory">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal mb-4 text-balance">Featured Collections</h2>
          <p className="text-lg text-brand-charcoal/60 max-w-2xl mx-auto">Explore our expertly curated collections</p>
        </motion.div>

        {/* Carousel */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              onMouseEnter={() => setIsAutoplay(false)}
              onMouseLeave={() => setIsAutoplay(true)}
            >
              <Image
                src={
                  collections[current].handle === "heritage-indigo"
                    ? "/luxury-home-decor.jpg"
                    : collections[current].handle === "velvet-luxe"
                      ? "/velvet-throw.jpg"
                      : "/organic-runner.jpg"
                }
                alt={collections[current].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance"
                >
                  {collections[current].title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-gray-100 mb-6 max-w-xl"
                >
                  {collections[current].blurb}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Link
                    href={`/products?collection=${collections[current].handle}`}
                    className="inline-block px-8 py-3 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold"
                  >
                    Shop the Look
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 text-brand-charcoal hover:bg-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 text-brand-charcoal hover:bg-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {collections.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === current ? "bg-accent-gold w-8" : "bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
