"use client"

import { motion } from "framer-motion"
import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const lifestyleImages = [
  "https://images.unsplash.com/photo-1642657547271-722df15ce6d6?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1704428381443-03121831cc3d?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1694971166350-0bbc1089884b?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

export default function LifestyleShowcase() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1])

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#f7f5f2] via-[#efe9e3] to-[#f7f5f2] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-sm font-light tracking-widest text-[#c8b27c] uppercase">Lifestyle</span>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] mt-3 leading-tight">
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
              <div className="glass rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt={`Lifestyle ${idx + 1}`}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b2b]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
          className="mt-20 md:mt-28 glass rounded-2xl p-12 md:p-16"
        >
          <p className="text-xl md:text-2xl font-playfair text-[#2b2b2b] max-w-3xl mx-auto leading-relaxed">
            "Transform your living space into a sanctuary of elegance. Our carefully curated collections bring together timeless design and modern comfort, creating spaces where every moment feels intentional."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
