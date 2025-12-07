"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"

export function NewsletterBlock() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail("")
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-brand-sand">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-4">
            <Mail className="w-8 h-8 text-accent-gold" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-brand-charcoal mb-3">Stay Updated</h2>
          <p className="text-brand-charcoal/70 mb-8">
            Get first access to new collections, special offers, and design inspiration delivered to your inbox
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-white border border-brand-charcoal/20 text-brand-charcoal placeholder-brand-charcoal/50 focus:outline-none focus:border-accent-gold transition-colors"
            />
            <button
              type="submit"
              className="px-6 md:px-8 py-3 md:py-4 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold"
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-accent-gold font-medium"
            >
              Thank you for subscribing!
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
