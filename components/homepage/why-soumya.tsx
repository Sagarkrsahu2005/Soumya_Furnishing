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
    color: "from-rose-100 to-pink-50"
  },
  {
    icon: Scissors,
    title: "Elegant Craftsmanship",
    description: "Every stitch tells a story of precision and attention to detail.",
    color: "from-blue-100 to-cyan-50"
  },
  {
    icon: Gift,
    title: "Thoughtful Gifting",
    description: "Perfect for those who appreciate the finer things in home living.",
    color: "from-amber-100 to-orange-50"
  },
  {
    icon: Home,
    title: "Modern Indian Homes",
    description: "Designed with a deep understanding of contemporary Indian aesthetics.",
    color: "from-emerald-100 to-teal-50"
  },
]

export default function WhySoumya() {
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
          <span className="text-sm font-light tracking-widest text-amber-700 uppercase">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mt-3 leading-tight">
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
                <div className={`bg-gradient-to-br ${feature.color} backdrop-blur-lg border border-white/40 rounded-2xl p-8 h-full flex flex-col relative overflow-hidden hover:border-white/60 transition-all duration-300 hover:shadow-xl`}>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-slate-900/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-slate-900/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-slate-900" />
                    </div>

                    <h3 className="text-lg md:text-xl font-serif text-slate-900 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-sm md:text-base text-slate-700 font-light leading-relaxed">
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
