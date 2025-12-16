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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#f7f5f2] via-[#efe9e3] to-[#f7f5f2]">
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
              <span className="text-sm font-light tracking-widest text-[#c8b27c] uppercase">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] leading-tight">
                Designed for Indian Homes
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg text-[#5f5f5f] font-light leading-relaxed">
              We believe that luxury isn't about excess—it's about intention. Every cushion, curtain, and bedsheet in our collection is thoughtfully curated to bring comfort and elegance into your home.
            </motion.p>

            <motion.p variants={itemVariants} className="text-lg text-[#5f5f5f] font-light leading-relaxed">
              With a deep understanding of modern Indian aesthetics, we blend timeless craftsmanship with contemporary design. Our fabrics tell stories of heritage and innovation.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4 space-y-3">
              <p className="flex items-center gap-3 text-[#5f5f5f]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8b27c]" />
                Thoughtfully curated textures
              </p>
              <p className="flex items-center gap-3 text-[#5f5f5f]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8b27c]" />
                Comfort that feels luxurious
              </p>
              <p className="flex items-center gap-3 text-[#5f5f5f]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8b27c]" />
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
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden glass">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=700&fit=crop"
                alt="Premium home furnishings"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b2b]/10 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
