"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

const ugcItems = [
  { id: "1", image: "/luxury-home-decor.jpg" },
  { id: "2", image: "/indigo-cushion.jpg" },
  { id: "3", image: "/table-runner.jpg" },
  { id: "4", image: "/outdoor-rug.jpg" },
  { id: "5", image: "/wool-rug.jpg" },
  { id: "6", image: "/artisan-textile-studio-india.jpg" },
]

export function UGCGrid() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal mb-4 text-balance">#MySoumyaHome</h2>
          <p className="text-lg text-brand-charcoal/60 max-w-2xl mx-auto">
            See how our customers style their spaces with Soumya Furnishings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.05 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {ugcItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="relative h-64 md:h-72 overflow-hidden group cursor-pointer"
              onClick={() => setSelectedId(item.id)}
            >
              <Image
                src={item.image}
                alt="Customer home"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-lg text-brand-charcoal/60 mb-6">Tag us @soumyafurnishings on Instagram to be featured</p>
          <a
            href="https://instagram.com"
            className="inline-block px-8 py-3 border-2 border-accent-gold text-accent-gold font-semibold hover:bg-accent-gold hover:text-white transition-all duration-300"
          >
            Share Your Story
          </a>
        </motion.div>
      </div>
    </section>
  )
}
