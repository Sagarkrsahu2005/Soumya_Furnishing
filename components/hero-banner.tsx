"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export function HeroBanner() {
  return (
    <div className="relative h-screen md:h-[700px] w-full overflow-hidden bg-brand-sand">
      {/* Background Image with Premium Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/luxury-living-room-with-artisan-textiles.jpg"
          alt="Luxury home décor"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 md:mb-6"
        >
          <span className="inline-block text-accent-gold text-sm md:text-base font-semibold tracking-widest uppercase">
            Premium Living Reimagined
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-6 md:mb-8 font-bold tracking-tight text-balance drop-shadow-2xl">
          Elevate Your Everyday
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-gray-50 mb-10 max-w-3xl font-light leading-relaxed drop-shadow-lg"
        >
          Comfort in Every Stitch — Artisan-crafted furnishings from India, designed for those who value timeless
          elegance
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/products"
            className="px-10 md:px-14 py-4 md:py-5 bg-accent-gold text-white font-semibold rounded-lg hover:bg-accent-gold-light transition-all duration-300 shadow-hover hover:shadow-elevated hover:scale-105 active:scale-95 text-lg"
          >
            Explore Collection
          </Link>
          <Link
            href="/about"
            className="px-10 md:px-14 py-4 md:py-5 glass text-white font-semibold rounded-lg hover:bg-white/60 transition-all duration-300 hover:shadow-elevated text-lg"
          >
            Our Story
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  )
}
