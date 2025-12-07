"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const rooms = [
  { name: "Living Room", slug: "Living", image: "/luxury-living-room-with-artisan-textiles.jpg" },
  { name: "Bedroom", slug: "Bedroom", image: "/bedroom-canopy.jpg" },
  { name: "Dining", slug: "Dining", image: "/table-runner.jpg" },
  { name: "Outdoor", slug: "Outdoor", image: "/outdoor-cushion.jpg" },
]

export function RoomTiles() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal mb-4 text-balance">Shop by Room</h2>
          <p className="text-lg text-brand-charcoal/60 max-w-2xl mx-auto">
            Discover curated collections designed for every space in your home
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {rooms.map((room) => (
            <motion.div key={room.slug} variants={itemVariants}>
              <Link href={`/products?room=${room.slug}`}>
                <div className="relative h-80 md:h-96 overflow-hidden group cursor-pointer">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white text-center">{room.name}</h3>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 text-accent-gold font-semibold border-b-2 border-accent-gold"
                    >
                      Shop Now
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
