"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function BrandPhilosophy() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-white via-stone-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="text-sm font-light tracking-widest text-amber-700 uppercase">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
                Designed for Indian Homes
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg text-slate-700 font-light leading-relaxed">
              We believe that luxury isn't about excess—it's about intention. Every cushion, curtain, and bedsheet in our collection is thoughtfully curated to bring comfort and elegance into your home.
            </motion.p>

            <motion.p variants={itemVariants} className="text-lg text-slate-600 font-light leading-relaxed">
              With a deep understanding of modern Indian aesthetics, we blend timeless craftsmanship with contemporary design. Our fabrics tell stories of heritage and innovation.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4 space-y-3">
              <p className="flex items-center gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Thoughtfully curated textures
              </p>
              <p className="flex items-center gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Comfort that feels luxurious
              </p>
              <p className="flex items-center gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Premium fabrics sourced with care
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Glass Card Image */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=700&fit=crop"
                alt="Premium home furnishings"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
