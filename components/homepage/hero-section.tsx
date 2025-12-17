"use client"

import { motion } from "framer-motion"
import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ChevronDown } from "lucide-react"

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section ref={ref} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Luxury gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7f5f2] via-[#efe9e3] to-[#f7f5f2]" />

      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8b27c] rounded-full blur-3xl opacity-5" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#9dafa2] rounded-full blur-3xl opacity-5" />

      {/* Parallax background image with overlay */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f7f5f2]" />
      </motion.div>

      {/* Main content container */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Luxury accent line */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#c8b27c] to-transparent" />
          </motion.div>

          {/* Main headline with serif elegance */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-semibold text-[#2b2b2b] leading-tight"
            style={{ letterSpacing: "0.02em" }}
          >
            Elevate Your <span className="text-[#c8b27c] block">Living</span>
          </motion.h1>

          {/* Subheading with warmth */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-[#5f5f5f] max-w-2xl mx-auto font-inter leading-relaxed"
            style={{ letterSpacing: "0.08em" }}
          >
            Discover premium home furnishings crafted with meticulous attention to detail. 
            <br className="hidden sm:block" />
            Timeless elegance for the modern Indian home.
          </motion.p>

          {/* Accent divider */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <div className="h-px w-16 bg-gradient-to-r from-[#9dafa2] via-[#c8b27c] to-[#9dafa2]" />
          </motion.div>

          {/* CTA Buttons with luxury styling */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            {/* Primary CTA */}
            <button className="group px-10 sm:px-12 py-4 sm:py-5 bg-[#2b2b2b] text-white rounded-lg font-inter font-medium text-base sm:text-lg tracking-wide transition-all duration-500 hover:bg-[#c8b27c] hover:text-[#2b2b2b] hover:shadow-lg relative overflow-hidden"
              style={{ letterSpacing: "0.12em" }}
            >
              <span className="relative z-10">Explore Collections</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#c8b27c] to-[#d9c4a3] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>

            {/* Secondary CTA */}
            <button className="group px-10 sm:px-12 py-4 sm:py-5 border-2 border-[#2b2b2b] text-[#2b2b2b] rounded-lg font-inter font-medium text-base sm:text-lg tracking-wide transition-all duration-500 hover:bg-[#2b2b2b] hover:text-white hover:shadow-lg relative overflow-hidden"
              style={{ letterSpacing: "0.12em" }}
            >
              <span className="relative z-10">New Arrivals</span>
            </button>
          </motion.div>

          {/* Premium trust badge area */}
          <motion.div
            variants={itemVariants}
            className="pt-8 flex justify-center gap-8 text-[#8c8c8c] text-sm font-inter"
            style={{ letterSpacing: "0.05em" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[#c8b27c]">✓</span> Curated Collections
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c8b27c]">✓</span> Premium Quality
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c8b27c]">✓</span> Expert Service
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator with luxury styling */}
      {/* <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs sm:text-sm text-[#8c8c8c] font-inter tracking-widest uppercase">
            Scroll to Explore
          </span>
          <div className="flex items-center justify-center">
            <ChevronDown className="w-5 h-5 text-[#c8b27c]" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div> */}
    </section>
  )
}
