"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ZoomIn } from "lucide-react"

interface ProductGalleryProps {
  images: { src: string; alt?: string }[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-brand-sand/30 overflow-hidden group cursor-zoom-in">
        <Image
          src={images[selectedIndex]?.src || "/placeholder.svg?key=plh01"}
          alt={images[selectedIndex]?.alt || title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onClick={() => setIsZoomed(!isZoomed)}
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
          <ZoomIn className="w-5 h-5 text-brand-charcoal" />
        </button>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-square overflow-hidden border-2 transition-all ${
              index === selectedIndex ? "border-accent-gold" : "border-brand-sand/30 hover:border-accent-gold/50"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={`${title} view ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
