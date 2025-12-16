"use client"

import { motion } from "framer-motion"
import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50" />
      
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop')] bg-cover bg-center opacity-15"
      />

      {/* Glass card container */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-3xl w-full backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-12 md:p-20 text-center shadow-2xl"
        >
          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-serif text-slate-900 mb-6 leading-tight tracking-tight"
          >
            Elevate Everyday Living
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-slate-700 mb-12 font-light tracking-wide max-w-2xl mx-auto"
          >
            Premium home furnishings crafted for comfort & elegance. Thoughtfully designed for modern Indian homes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 text-lg font-medium backdrop-blur-lg hover:shadow-xl">
              Explore Collection
            </button>
            <button className="px-8 py-4 border-2 border-slate-900 text-slate-900 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300 text-lg font-medium backdrop-blur-lg">
              Shop New Arrivals
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-slate-600 font-light">Scroll to explore</span>
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
