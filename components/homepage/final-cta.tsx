"use client"

import { motion } from "framer-motion"

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#2b2b2b] via-[#3a3a3a] to-[#2b2b2b] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8b27c]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9dafa2]/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-playfair text-white leading-tight">
            Bring Home Comfort That Feels Curated
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-[#e8ddd5] font-light max-w-2xl mx-auto">
            Every piece in our collection is selected with intention, designed to elevate your everyday moments and bring lasting beauty to your home.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <button className="px-10 py-4 bg-[#c8b27c] text-[#2b2b2b] rounded-lg hover:bg-[#d9c4a3] transition-all duration-300 text-lg font-medium shadow-xl hover:shadow-2xl font-inter font-semibold tracking-wide">
              Shop the Collection
            </button>
            <button className="px-10 py-4 border-2 border-[#c8b27c] text-[#c8b27c] rounded-lg hover:bg-[#c8b27c]/10 transition-all duration-300 text-lg font-medium backdrop-blur-lg font-inter font-semibold tracking-wide">
              Learn More
            </button>
          </motion.div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-sm text-[#8c8c8c] font-light tracking-widest uppercase pt-8"
          >
            Luxury redefined for modern Indian homes
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
