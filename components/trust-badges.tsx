"use client"

import { motion } from "framer-motion"
import { Truck, RefreshCw, Shield } from "lucide-react"

interface TrustBadgesProps {
  freeShippingThreshold?: number
}

export function TrustBadges({ freeShippingThreshold = 2000 }: TrustBadgesProps) {
  const badges = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: `Free delivery on orders above ₹${freeShippingThreshold.toLocaleString("en-IN")}`,
    },
    {
      icon: RefreshCw,
      title: "30-Day Returns",
      description: "Hassle-free returns within 30 days of purchase",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "SSL encrypted checkout with multiple payment options",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-brand-sand/20 p-6 md:p-8 rounded border border-brand-sand/30"
    >
      {badges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0">
              <Icon className="w-6 h-6 text-accent-gold" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-charcoal text-sm">{badge.title}</h4>
              <p className="text-xs text-brand-charcoal/60">{badge.description}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
