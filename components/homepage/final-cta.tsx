"use client"

import { motion } from "framer-motion"

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
            Bring Home Comfort That Feels Curated
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto">
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
            <button className="px-10 py-4 bg-white text-slate-900 rounded-full hover:bg-amber-50 transition-all duration-300 text-lg font-medium shadow-xl hover:shadow-2xl">
              Shop the Collection
            </button>
            <button className="px-10 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 text-lg font-medium backdrop-blur-lg">
              Learn More
            </button>
          </motion.div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-sm text-slate-400 font-light tracking-widest uppercase pt-8"
          >
            Luxury redefined for modern Indian homes
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
