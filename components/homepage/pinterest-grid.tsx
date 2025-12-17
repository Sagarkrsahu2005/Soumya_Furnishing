"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const gridImages = [
  "https://images.unsplash.com/photo-1617099443741-a9b51eabd2b8?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1606380588797-21fcaca88b62?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1721523237766-7e1b014256a8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1650091063553-58b5f50b59ca?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1721274503515-fb3f6ace82a4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1722942631531-5b09fed44978?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

export default function PinterestGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const heights = ["h-64", "h-80", "h-64", "h-72", "h-64", "h-80"]

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#f7f5f2] via-[#efe9e3] to-[#f7f5f2]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-sm font-light tracking-widest text-[#c8b27c] uppercase">Inspiration</span>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] mt-3 leading-tight">
            Curated Moments
          </h2>
          <p className="text-lg text-[#5f5f5f] mt-4 font-light max-w-2xl mx-auto">
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
              <div className="glass rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt={`Curated moment ${idx + 1}`}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b2b]/60 via-[#2b2b2b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
