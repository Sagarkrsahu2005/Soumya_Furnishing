"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Sparkles, Scissors, Gift, Home } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Premium Fabrics",
    description: "Sourced from the finest mills, each fabric is selected for its quality and feel.",
    gradientStart: "#c8b27c",
    gradientEnd: "#d9c4a3"
  },
  {
    icon: Scissors,
    title: "Elegant Craftsmanship",
    description: "Every stitch tells a story of precision and attention to detail.",
    gradientStart: "#b6a99a",
    gradientEnd: "#c8b27c"
  },
  {
    icon: Gift,
    title: "Thoughtful Gifting",
    description: "Perfect for those who appreciate the finer things in home living.",
    gradientStart: "#9dafa2",
    gradientEnd: "#b6a99a"
  },
  {
    icon: Home,
    title: "Modern Indian Homes",
    description: "Designed with a deep understanding of contemporary Indian aesthetics.",
    gradientStart: "#d9c4a3",
    gradientEnd: "#efe9e3"
  },
]

export default function WhySoumya() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#f1f8f2] via-[#e8f5e9] to-[#dcedc8] relative overflow-hidden">
      {/* Decorative glow effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#c8b27c] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#9dafa2] rounded-full blur-[150px]" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-sm font-light tracking-widest text-[#c8b27c] uppercase">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] mt-3 leading-tight">
            The Soumya Promise
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <div 
                  style={{
                    background: `linear-gradient(135deg, ${feature.gradientStart}20 0%, ${feature.gradientEnd}20 100%)`
                  }}
                  className="rounded-2xl p-8 h-full flex flex-col relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm border border-[#e5e1da]"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#4A90E2]/10 to-transparent" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-[#4A90E2]/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#4A90E2]/30 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#2b2b2b]" />
                    </div>

                    <h3 className="text-lg md:text-xl font-playfair text-[#2b2b2b] mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-sm md:text-base text-[#5f5f5f] font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
