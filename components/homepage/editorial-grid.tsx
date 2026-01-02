"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const editorialImages = [
  {
    src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1528&auto=format&fit=crop",
    className: "rounded-[32px] h-[420px] md:h-[520px]",
  },
  {
    src: "https://images.unsplash.com/photo-1524758870432-af57e54afa26?q=80&w=987&auto=format&fit=crop",
    className: "rounded-[32px] h-[260px] md:h-[320px]",
  },
  {
    src: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=987&auto=format&fit=crop",
    className: "rounded-[32px] h-[320px] md:h-[380px]",
  },
]

export default function EditorialGrid() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!sectionRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      imageRefs.current.forEach((node, idx) => {
        if (!node) return

        gsap.to(node, {
          yPercent: idx % 2 === 0 ? -8 : 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
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
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
        <div className="space-y-8">
          <p className="text-sm uppercase tracking-[0.4em] text-[#c8b27c] font-inter">
            Soumya Edit
          </p>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] leading-tight">
            Slow-crafted interiors inspired by boutique stays
          </h2>
          <p className="text-lg text-[#5f5f5f] leading-relaxed">
            Layer textures, tone-on-tone hues, and generous proportions to bring calm energy
            into everyday rituals. Each vignette is curated with organic silhouettes,
            sculptural lighting, and soft-touch fabrics sourced from master weavers across India.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-[#9dafa2]">Material Play</p>
              <p className="text-[#2b2b2b] text-lg">Belgian linen, cotton-linen blends, and handloom jacquards.</p>
            </div>
            <div className="glass rounded-2xl p-6 space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-[#c8b27c]">Mood Lighting</p>
              <p className="text-[#2b2b2b] text-lg">Sheer drapes meet weighty curtains for layered ambiance.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:gap-8">
          {editorialImages.map((image, idx) => (
            <div
              key={image.src}
              ref={(el) => {
                if (el) imageRefs.current[idx] = el
              }}
              className={`relative overflow-hidden ${image.className}`}
            >
              <Image
                src={image.src}
                alt="Editorial showcase"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f]/40 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
