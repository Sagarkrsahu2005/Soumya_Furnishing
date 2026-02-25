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
      <div className="relative w-full aspect-square bg-[#2d2d2d] overflow-hidden group cursor-zoom-in rounded-xl">
        <Image
          src={images[selectedIndex]?.src || "/placeholder.svg?key=plh01"}
          alt={images[selectedIndex]?.alt || title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onClick={() => setIsZoomed(!isZoomed)}
        />
        <button className="absolute top-4 right-4 p-2 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-full hover:bg-[#1a1a1a] transition-colors opacity-0 group-hover:opacity-100">
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-square overflow-hidden border-2 rounded-lg transition-all ${
              index === selectedIndex ? "border-[#4A90E2]" : "border-white/20 hover:border-[#4A90E2]/50"
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
