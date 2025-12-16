"use client"

import { motion } from "framer-motion"
import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const lifestyleImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=900&fit=crop",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=900&fit=crop",
  "https://images.unsplash.com/photo-1567016376408-0226e4d0cdd6?w=800&h=900&fit=crop",
]

export default function LifestyleShowcase() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1])

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-stone-50 via-white to-amber-50 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-sm font-light tracking-widest text-amber-700 uppercase">Lifestyle</span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-3 leading-tight">
            Live the Soumya Experience
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {lifestyleImages.map((image, idx) => (
            <motion.div
              key={idx}
              style={{ opacity, scale }}
              className="group relative h-96 md:h-[500px] rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Glass Card Container */}
              <div className="absolute inset-0 backdrop-blur-lg bg-white/5 border border-white/20 rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt={`Lifestyle ${idx + 1}`}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Text Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-8 text-white"
                >
                  <p className="font-light text-sm tracking-wide">Discover More</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Magazine-style text section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-28 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 md:p-16"
        >
          <p className="text-xl md:text-2xl font-serif text-slate-900 max-w-3xl mx-auto leading-relaxed">
            "Transform your living space into a sanctuary of elegance. Our carefully curated collections bring together timeless design and modern comfort, creating spaces where every moment feels intentional."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
