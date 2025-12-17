"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const featuredProducts = [
  {
    title: "Cushions",
    subtitle: "Comfort meets elegance",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/collections/cushions",
    color: "#c8b27c",
  },
  {
    title: "Curtains",
    subtitle: "Light and privacy perfected",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1000&h=1000&fit=crop",
    href: "/collections/curtains",
    color: "#9dafa2",
  },
  {
    title: "Bedsheets",
    subtitle: "Sleep on pure luxury",
    image: "https://images.unsplash.com/photo-1728614669329-29e10a0698ea?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/collections/bedsheets",
    color: "#b6a99a",
  },
]

export default function FeaturedProductStrip() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!sectionRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        if (!card) return

        gsap.to(card.querySelector("[data-featured-image]"), {
          yPercent: 10 + idx * 2,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-white via-[#f7f5f2] to-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-sm font-light tracking-widest text-[#c8b27c] uppercase">
            Premium Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] mt-3 leading-tight">
            Featured Categories
          </h2>
        </div>

        {/* Three column feature strip */}
        <div className="grid md:grid-cols-3 gap-8">
          {featuredProducts.map((product, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el
              }}
              className="group relative h-96 md:h-[450px] rounded-3xl overflow-hidden"
            >
              {/* Parallax image */}
              <div
                data-featured-image
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b2b]/70 via-[#2b2b2b]/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                {/* Top accent */}
                <div className="w-12 h-1 rounded-full" style={{ backgroundColor: product.color }} />

                {/* Bottom content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-playfair text-white font-semibold mb-2">
                      {product.title}
                    </h3>
                    <p className="text-white/70 font-inter text-sm md:text-base font-light">
                      {product.subtitle}
                    </p>
                  </div>

                  <Link href={product.href}>
                    <button
                      className="group/btn flex items-center gap-2 px-6 py-3 rounded-lg glass hover:bg-white/20 transition-all duration-300"
                      style={{ letterSpacing: "0.08em" }}
                    >
                      <span className="text-white font-inter font-medium text-sm md:text-base uppercase tracking-wide">
                        Explore
                      </span>
                      <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Border glow */}
              <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/30 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
