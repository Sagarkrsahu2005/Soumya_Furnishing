"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const rooms = [
  {
    title: "Bedroom",
    description: "Bedsheets, cushions, comfort layers",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dp",
    href: "/collections/bedroom",
    color: "#c8b27c",
  },
  {
    title: "Living Room",
    description: "Statement cushions & elegant textures",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/collections/living-room",
    color: "#9dafa2",
  },
  {
    title: "Kitchen",
    description: "Table linen & everyday luxury",
    image: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/collections/kitchen",
    color: "#b6a99a",
  },
  {
    title: "Dining",
    description: "Napkins, runners, hosting essentials",
    image: "https://images.unsplash.com/photo-1616486886892-ff366aa67ba4?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    href: "/collections/dining",
    color: "#d9c4a3",
  },
]

export default function ShopByRoom() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!sectionRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Stagger parallax on room cards
      cardsRef.current.forEach((card, idx) => {
        if (!card) return

        const parallaxAmount = 8 + idx * 2 // Staggered: 8, 10, 12, 14

        gsap.to(card.querySelector("[data-parallax-image]"), {
          yPercent: parallaxAmount,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top center",
            end: "bottom center",
            scrub: 2,
            markers: false,
            invalidateOnRefresh: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f2] to-[#e8f5e9]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-sm font-light tracking-widest text-[#4A90E2] uppercase">
            Collections
          </span>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] mt-3 leading-tight">
            Choose by Your Room
          </h2>
          <p className="text-lg text-[#5f5f5f] mt-4 font-light max-w-2xl mx-auto">
            Thoughtfully curated collections for every space in your home
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el
              }}
              className="group relative h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Image with parallax */}
              <div
                data-parallax-image
                className="absolute inset-0 will-change-transform scale-110"
              >
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={idx < 2}
                />
              </div>

              {/* Glass overlay with gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#2b2b2b]/60 via-[#2b2b2b]/20 to-transparent"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(43, 43, 43, 0), rgba(43, 43, 43, 0.2), ${room.color}15)`,
                }}
              />

              {/* Glass card container */}
              <div className="absolute inset-0 pointer-events-none" />

              {/* Content - absolute bottom with glass */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <div className="glass rounded-2xl p-6 md:p-8 backdrop-blur-xl">
                  <h3 className="text-2xl md:text-3xl font-playfair text-white font-semibold mb-2">
                    {room.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/80 font-inter mb-6 font-light">
                    {room.description}
                  </p>

                  <Link href={room.href} className="inline-block">
                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/90 text-[#2b2b2b] font-inter font-medium text-sm md:text-base tracking-wide hover:bg-white transition-all duration-300 group/btn"
                      style={{ letterSpacing: "0.08em" }}
                    >
                      Explore {room.title}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/30 transition-colors duration-300 pointer-events-none" />
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_rgba(200,178,124,0.15)] pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
