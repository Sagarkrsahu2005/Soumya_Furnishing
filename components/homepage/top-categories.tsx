"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    id: "bedding",
    title: "Premium Bedding",
    subtitle: "Sleep in Luxury",
    description: "Egyptian cotton sheets, velvet throws, and silk pillows",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop",
    href: "/collections/bedding",
    accent: "#9dafa2",
  },
  {
    id: "cushions",
    title: "Artisan Cushions",
    subtitle: "Handcrafted Details",
    description: "Hand-embroidered, block-printed, and handloom woven",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
    href: "/collections/cushions",
    accent: "#c8b27c",
  },
  {
    id: "curtains",
    title: "Designer Curtains",
    subtitle: "Light & Shadow",
    description: "Sheer drapes, blackout panels, and layered textures",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop",
    href: "/collections/curtains",
    accent: "#b6a99a",
  },
  {
    id: "rugs",
    title: "Luxury Rugs",
    subtitle: "Foundation of Elegance",
    description: "Hand-woven wool, jute runners, and vintage-inspired",
    image: "https://images.unsplash.com/photo-1600166898823-c0f9c9c7b470?q=80&w=1200&auto=format&fit=crop",
    href: "/collections/rugs",
    accent: "#c48d70",
  },
  {
    id: "table-linen",
    title: "Table Linen",
    subtitle: "Dining Elegance",
    description: "Premium napkins, runners, and placemats for every occasion",
    image: "https://images.unsplash.com/photo-1515169273894-7e876dcf13da?q=80&w=1200&auto=format&fit=crop",
    href: "/collections/table-linen",
    accent: "#d4a59a",
  },
  {
    id: "throws",
    title: "Luxury Throws",
    subtitle: "Cozy Comfort",
    description: "Cashmere, velvet, and wool throws for layered warmth",
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=1200&auto=format&fit=crop",
    href: "/collections/throws",
    accent: "#a8b5a0",
  },
]

export default function TopCategories() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!sectionRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Staggered 3D card entrance
      cardRefs.current.forEach((card, idx) => {
        if (!card) return

        gsap.from(card, {
          opacity: 0,
          scale: 0.8,
          rotateY: -15,
          z: -200,
          duration: 1,
          delay: idx * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        })
      })

      // Continuous parallax on images
      parallaxRefs.current.forEach((node, idx) => {
        if (!node) return

        const movement = idx % 2 === 0 ? -15 : 15
        const rotation = idx % 2 === 0 ? -2 : 2

        gsap.to(node, {
          yPercent: movement,
          rotation,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.5,
            invalidateOnRefresh: true,
          },
        })
      })

      // Floating animation for accent blobs
      gsap.to(".accent-blob", {
        y: 20,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#f1f8f2] via-[#f9fdf9] to-[#e8f5e9] relative overflow-hidden"
      style={{ perspective: "2000px" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="accent-blob absolute top-20 right-10 w-[500px] h-[500px] bg-[#c8b27c] rounded-full blur-[120px]" />
        <div className="accent-blob absolute bottom-20 left-10 w-[600px] h-[600px] bg-[#9dafa2] rounded-full blur-[150px]" />
        <div className="accent-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#b6a99a] rounded-full blur-[130px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#2b2b2b 1px, transparent 1px), linear-gradient(90deg, #2b2b2b 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-sm uppercase tracking-[0.5em] text-[#4A90E2] mb-6 animate-[fadeInUp_0.6s_ease-out_forwards]">
            Discover Our World
          </p>
          <h2
            className="text-4xl md:text-5xl font-playfair font-semibold text-[#2b2b2b] leading-[1.1] mb-8 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]"
          >
            Top Categories
          </h2>
          <p className="text-lg md:text-xl text-[#5f5f5f] max-w-2xl mx-auto leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.3s_forwards]">
            Where heritage craftsmanship meets contemporary elegance
          </p>
        </div>

        {/* 6 Card Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {categories.map((category, idx) => {

            return (
              <Link
                key={category.id}
                href={category.href}
                ref={(el) => {
                  if (el) cardRefs.current[idx] = el
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative h-[450px] md:h-[520px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-sm border border-[#e5e1da] overflow-hidden transition-all duration-700 group-hover:border-[#4A90E2] group-hover:shadow-2xl group-hover:shadow-[#4A90E2]/10">
                  {/* Image with parallax */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      ref={(el) => {
                        if (el) parallaxRefs.current[idx] = el
                      }}
                      className="absolute inset-0 scale-110"
                    >
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                      />
                    </div>
                  </div>

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${category.accent}40 0%, transparent 70%)`,
                    }}
                  />

                  {/* Animated accent line */}
                  <div
                    className="absolute top-0 left-0 w-full h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
                    style={{ backgroundColor: category.accent }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                    {/* Top badge */}
                    <div className="flex justify-between items-start">
                      <div
                        className="inline-block px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.4em] font-semibold backdrop-blur-md border transition-all duration-500"
                        style={{
                          backgroundColor: `${category.accent}20`,
                          borderColor: `${category.accent}40`,
                          color: category.accent,
                        }}
                      >
                        Collection
                      </div>
                      <div className="text-[#2b2b2b]/40 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        0{idx + 1}
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                      <div>
                        <p
                          className="text-sm uppercase tracking-[0.4em] mb-3 font-semibold"
                          style={{ color: category.accent }}
                        >
                          {category.subtitle}
                        </p>
                        <h3 className="text-3xl md:text-4xl font-playfair text-white mb-4 leading-tight">
                          {category.title}
                        </h3>
                        <p className="text-white/90 text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {category.description}
                        </p>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                        <span className="text-sm uppercase tracking-[0.3em] font-semibold">
                          Explore Collection
                        </span>
                        <svg
                          className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${category.accent}15, transparent 40%)`,
                    }}
                  />
                </div>

                {/* 3D floating accent */}
                <div
                  className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-700 pointer-events-none"
                  style={{
                    backgroundColor: category.accent,
                    transform: hoveredIndex === idx ? "translateZ(50px)" : "translateZ(0)",
                  }}
                />
              </Link>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center animate-[fadeInUp_0.6s_ease-out_0.6s_forwards]">
          <Link
            href="/collections"
            className="group inline-flex items-center gap-4 px-10 py-5 rounded-full bg-[#2b2b2b] text-white text-sm uppercase tracking-[0.3em] font-semibold hover:bg-[#c8b27c] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#c8b27c]/20"
          >
            <span>View All Collections</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
