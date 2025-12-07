"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Leaf, Heart, Truck } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Artisan Heritage",
      description:
        "We partner with skilled craftspeople across India, preserving traditional techniques while embracing innovation.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "Every product is made with eco-conscious materials and sustainable practices, respecting both people and planet.",
    },
    {
      icon: Truck,
      title: "Fair Trade",
      description: "We ensure ethical sourcing and fair wages for all artisans in our supply chain.",
    },
  ]

  const media = [
    { name: "Vogue India", logo: "Vogue" },
    { name: "Elle Home", logo: "Elle" },
    { name: "Architectural Digest", logo: "AD" },
    { name: "Design Week", logo: "DW" },
  ]

  return (
    <main className="min-h-screen bg-brand-ivory">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] w-full overflow-hidden bg-brand-sand">
        <Image src="/artisans-at-work-handcrafting.jpg" alt="Artisans at work" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">Our Story</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl">
            Crafting beauty through heritage, sustainability, and artisan excellence
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* Brand Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-20 md:mb-32"
        >
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <Image src="/artisan-textile-studio-india.jpg" alt="Artisan studio" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal mb-6">Elevating Artisan Craft</h2>
            <p className="text-lg text-brand-charcoal/70 leading-relaxed mb-6">
              Soumya Furnishings was founded on the belief that luxury home décor should tell a story. Each piece in our
              collection represents the skill, dedication, and cultural heritage of Indian artisans.
            </p>
            <p className="text-lg text-brand-charcoal/70 leading-relaxed mb-6">
              We work directly with textile communities across India, from the indigo dyers of Rajasthan to the weavers
              of Odisha, ensuring fair compensation and sustainable practices.
            </p>
            <p className="text-lg text-brand-charcoal/70 leading-relaxed">
              Every purchase supports not just a product, but a family's livelihood and the preservation of
              centuries-old craftsmanship.
            </p>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-32"
        >
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal mb-4 text-balance">Our Values</h2>
            <p className="text-lg text-brand-charcoal/60 max-w-2xl mx-auto">Guiding every decision we make</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 md:p-10 rounded-lg border-t-4 border-accent-gold shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-sand/30 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-accent-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-charcoal mb-3">{value.title}</h3>
                  <p className="text-brand-charcoal/70 leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Sustainability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-brand-sand/30 p-8 md:p-16 rounded-lg mb-20 md:mb-32"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-8">Sustainable from the Ground Up</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-brand-charcoal mb-3">Eco-Friendly Materials</h3>
              <p className="text-brand-charcoal/70 leading-relaxed mb-6">
                We source organic cotton, linen, wool, and natural dyes. All packaging is biodegradable or recycled.
              </p>
              <h3 className="font-semibold text-brand-charcoal mb-3">Carbon-Neutral Shipping</h3>
              <p className="text-brand-charcoal/70 leading-relaxed">
                Every order is shipped with carbon offset, ensuring minimal environmental impact.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-charcoal mb-3">Ethical Production</h3>
              <p className="text-brand-charcoal/70 leading-relaxed mb-6">
                We follow fair trade principles with transparent supply chains and regular audits.
              </p>
              <h3 className="font-semibold text-brand-charcoal mb-3">Community Impact</h3>
              <p className="text-brand-charcoal/70 leading-relaxed">
                5% of all profits go to artisan education programs and community development.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-12 md:mb-16">In the Media</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {media.map((outlet) => (
              <motion.div
                key={outlet.name}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white rounded border border-brand-sand/30 hover:border-accent-gold/50 transition-colors cursor-pointer"
              >
                <p className="font-semibold text-brand-charcoal text-sm md:text-base">{outlet.logo}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 md:mt-16">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold"
            >
              Visit Our Studio
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
