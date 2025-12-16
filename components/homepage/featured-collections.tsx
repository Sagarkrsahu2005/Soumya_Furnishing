"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ChevronRight } from "lucide-react"

const collections = [
  { name: "Cushions", count: "180+", gradientStart: "#c8b27c", gradientEnd: "#d9c4a3" },
  { name: "Curtains", count: "120+", gradientStart: "#b6a99a", gradientEnd: "#c8b27c" },
  { name: "Bedsheets", count: "95+", gradientStart: "#9dafa2", gradientEnd: "#b6a99a" },
  { name: "Table Linen", count: "65+", gradientStart: "#d9c4a3", gradientEnd: "#efe9e3" },
]

export default function FeaturedCollections() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
          <span className="text-sm font-light tracking-widest text-[#c8b27c] uppercase">Collections</span>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] mt-3 leading-tight">
            Featured Collections
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group cursor-pointer"
            >
              <div 
                style={{
                  background: `linear-gradient(135deg, ${collection.gradientStart}20 0%, ${collection.gradientEnd}20 100%)`
                }}
                className="glass rounded-2xl p-8 h-64 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-playfair text-[#2b2b2b] mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-[#5f5f5f] font-light">
                    {collection.count} Products
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase font-light text-[#5f5f5f]">Explore</span>
                  <ChevronRight className="w-5 h-5 text-[#c8b27c] group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 border-2 border-[#2b2b2b] text-[#2b2b2b] rounded-full hover:bg-[#2b2b2b] hover:text-white transition-all duration-300 font-medium">
            View All Collections
          </button>
        </motion.div>
      </div>
    </section>
  )
}
