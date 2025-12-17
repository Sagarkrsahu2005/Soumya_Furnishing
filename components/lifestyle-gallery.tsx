"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const lifestyleImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=800&fit=crop", span: "col-span-2 row-span-2" },
  { id: 2, src: "https://images.unsplash.com/photo-1605217613423-0a61bd725c8a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", span: "col-span-1" },
  { id: 3, src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", span: "col-span-1" },
  { id: 4, src: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop", span: "col-span-1" },
  { id: 5, src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=800&fit=crop", span: "col-span-1 row-span-2" },
  { id: 6, src: "https://images.unsplash.com/photo-1655146088833-550e2c70066b?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", span: "col-span-2" },
]

export default function LifestyleGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!sectionRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Stagger parallax on gallery images
      imagesRef.current.forEach((img, idx) => {
        if (!img) return

        // Vary parallax depth based on position
        const parallaxAmount = 6 + (idx % 3) * 3 // 6, 9, 12, 6, 9, 12...

        gsap.to(img, {
          yPercent: parallaxAmount,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            markers: false,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 px-4 md:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-sm font-light tracking-widest text-[#c8b27c] uppercase">
            Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] mt-3 leading-tight">
            Lifestyle Moments
          </h2>
          <p className="text-lg text-[#5f5f5f] mt-4 font-light max-w-2xl mx-auto">
            Discover inspiring interiors crafted with intention
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px] md:auto-rows-[280px]">
          {lifestyleImages.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) imagesRef.current[idx] = el
              }}
              className={`${item.span} group relative rounded-2xl overflow-hidden cursor-pointer`}
            >
              {/* Glass container */}
              <div className="glass rounded-2xl absolute inset-0 z-0" />

              {/* Image */}
              <Image
                src={item.src}
                alt={`Lifestyle ${item.id}`}
                fill
                className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b2b]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover text */}
              <div className="absolute inset-0 flex items-end justify-start p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm md:text-base font-inter tracking-wide font-light">
                  View Collection
                </span>
              </div>

              {/* Border */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
