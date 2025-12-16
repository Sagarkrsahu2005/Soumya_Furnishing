"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ChevronRight } from "lucide-react"

const collections = [
  { name: "Cushions", count: "180+", color: "from-rose-100 to-rose-50" },
  { name: "Curtains", count: "120+", color: "from-slate-100 to-stone-50" },
  { name: "Bedsheets", count: "95+", color: "from-amber-100 to-orange-50" },
  { name: "Table Linen", count: "65+", color: "from-teal-100 to-cyan-50" },
]

export default function FeaturedCollections() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-sm font-light tracking-widest text-amber-700 uppercase">Collections</span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-3 leading-tight">
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
              <div className={`bg-gradient-to-br ${collection.color} backdrop-blur-lg border border-white/40 rounded-2xl p-8 h-64 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-white/60`}>
                {/* Background glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-slate-600 font-light">
                    {collection.count} Products
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase font-light text-slate-700">Explore</span>
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:translate-x-1 transition-transform duration-300" />
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
          <button className="px-8 py-4 border-2 border-slate-900 text-slate-900 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300 font-medium">
            View All Collections
          </button>
        </motion.div>
      </div>
    </section>
  )
}
