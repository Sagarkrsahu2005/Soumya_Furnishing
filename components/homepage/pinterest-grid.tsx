"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const gridImages = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1567016376408-0226e4d0cdd6?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1584622614875-e51df1bdc82f?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=600&fit=crop",
]

export default function PinterestGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const heights = ["h-64", "h-80", "h-64", "h-72", "h-64", "h-80"]

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-stone-50 via-white to-stone-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-sm font-light tracking-widest text-amber-700 uppercase">Inspiration</span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-3 leading-tight">
            Curated Moments
          </h2>
          <p className="text-lg text-slate-600 mt-4 font-light max-w-2xl mx-auto">
            Discover elegant interiors and timeless moments that inspire
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid md:grid-cols-3 gap-6 auto-rows-max">
          {gridImages.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`${heights[idx]} group relative rounded-xl overflow-hidden cursor-pointer`}
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-white/5 border border-white/30 rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt={`Curated moment ${idx + 1}`}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-6 text-white"
                >
                  <p className="text-sm font-light tracking-wide">View Collection</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
