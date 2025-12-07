"use client"

import { motion } from "framer-motion"
import { Leaf, Shield } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Artisan-Crafted",
    description: "Handcrafted by skilled artisans from India with decades of heritage",
  },
  {
    icon: Shield,
    title: "Premium Materials",
    description: "Ethically sourced fabrics and materials with rigorous quality standards",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Eco-friendly packaging and carbon-neutral shipping on every order",
  },
]

export function WhyUsCards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

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
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal mb-4 text-balance">Why Choose Soumya</h2>
          <p className="text-lg text-brand-charcoal/60 max-w-2xl mx-auto">
            Discover what sets us apart in the world of luxury home décor
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 md:p-10 bg-white rounded-lg border-t-4 border-accent-gold shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-brand-sand/30 flex items-center justify-center mb-6 group-hover:bg-brand-sage/30 transition-colors">
                  <Icon className="w-8 h-8 text-accent-gold" />
                </div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-3">{feature.title}</h3>
                <p className="text-brand-charcoal/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
