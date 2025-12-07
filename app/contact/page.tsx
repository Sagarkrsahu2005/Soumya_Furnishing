"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", message: "" })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@soumyafurnishings.com",
      href: "mailto:hello@soumyafurnishings.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Bangalore, India",
      href: "#map",
    },
  ]

  return (
    <main className="min-h-screen bg-brand-ivory">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-4 text-balance">Get in Touch</h1>
          <p className="text-lg text-brand-charcoal/60 max-w-2xl mx-auto">
            Have a question about our products or want to collaborate? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-20 md:mb-32">
          {/* Contact Info */}
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <motion.a
                key={index}
                href={info.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg border border-brand-sand/30 hover:border-accent-gold transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-brand-sand/30 flex items-center justify-center mb-4 group-hover:bg-accent-gold/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent-gold" />
                </div>
                <h3 className="font-semibold text-brand-charcoal mb-2">{info.title}</h3>
                <p className="text-brand-charcoal/70 hover:text-accent-gold transition-colors">{info.value}</p>
              </motion.a>
            )
          })}
        </div>

        {/* Contact Form & Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-brand-charcoal mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-brand-sand text-brand-charcoal placeholder-brand-charcoal/50 focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-brand-sand text-brand-charcoal placeholder-brand-charcoal/50 focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-brand-sand text-brand-charcoal placeholder-brand-charcoal/50 focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-brand-sand text-brand-charcoal placeholder-brand-charcoal/50 focus:outline-none focus:border-accent-gold transition-colors resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-3 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold"
              >
                Send Message
              </button>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-accent-gold font-medium"
                >
                  Thank you! We'll get back to you soon.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Info & Hours */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-brand-charcoal mb-4">Business Hours</h3>
              <div className="space-y-2 text-brand-charcoal/70">
                <p>
                  <span className="font-medium text-brand-charcoal">Monday - Friday:</span> 10:00 AM - 6:00 PM IST
                </p>
                <p>
                  <span className="font-medium text-brand-charcoal">Saturday:</span> 11:00 AM - 5:00 PM IST
                </p>
                <p>
                  <span className="font-medium text-brand-charcoal">Sunday:</span> Closed
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-brand-charcoal mb-4">Follow Us</h3>
              <div className="flex gap-6">
                <a
                  href="https://instagram.com"
                  className="p-3 rounded-full bg-brand-sand/30 text-accent-gold hover:bg-accent-gold/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  className="p-3 rounded-full bg-brand-sand/30 text-accent-gold hover:bg-accent-gold/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="bg-brand-sand/20 p-6 md:p-8 rounded border border-brand-sand/30">
              <h4 className="font-semibold text-brand-charcoal mb-2">Quick Response</h4>
              <p className="text-sm text-brand-charcoal/70">
                We typically respond to inquiries within 24 hours. For urgent matters, please call us during business
                hours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
