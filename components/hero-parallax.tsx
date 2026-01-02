"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { ChevronDown } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function HeroParallax() {
  const heroRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!heroRef.current || prefersReducedMotion) return

    // Smooth scroll configuration
    gsap.config({
      force3D: true,
    })

    // Background parallax with smoother scrub
    gsap.to(bgRef.current, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        markers: false,
        invalidateOnRefresh: true,
      },
    })

    // Content card subtle parallax (upward) with smoother scrub
    gsap.to(contentRef.current, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-24"
    >
      {/* Background with parallax */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform scale-110">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            opacity: 0.55,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e9]/50 via-[#f1f8f2]/50 to-[#e8f5e9]/50" />

        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A90E2] rounded-full blur-3xl opacity-5" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7CB342] rounded-full blur-3xl opacity-5" />
      </div>

      {/* Fixed overlay for text readability */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e8f5e9]/40 pointer-events-none"
      />

      {/* Content card with parallax */}
      <div
        ref={contentRef}
        className="relative z-20 px-4 sm:px-6 lg:px-8 w-full max-w-3xl will-change-transform"
      >
        <div className="space-y-8 text-center">
          {/* Luxury accent line */}
          <div className="flex justify-center">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#4A90E2] to-transparent" />
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-semibold text-[#2b2b2b] leading-tight"
            style={{ letterSpacing: "0.02em" }}
          >
           Comfort Made <span className="text-[#4A90E2] block">Beautiful</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-base sm:text-lg md:text-xl text-[#5f5f5f] max-w-2xl mx-auto font-inter leading-relaxed"
            style={{ letterSpacing: "0.08em" }}
          >
            Thoughtfully crafted home furnishings that bring calm and elegance to modern Indian homes.
          </p>

          {/* Accent divider */}
          <div className="flex justify-center">
            <div className="h-px w-10 bg-gradient-to-r from-[#7CB342] via-[#4A90E2] to-[#7CB342]" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {/* Primary CTA */}
            <button
              className="group px-10 sm:px-12 py-4 sm:py-5 bg-[#2b2b2b] text-white rounded-lg font-inter font-medium text-base sm:text-lg tracking-wide transition-all duration-500 hover:bg-[#4A90E2] hover:text-white hover:shadow-lg relative overflow-hidden"
              style={{ letterSpacing: "0.12em" }}
            >
              <span className="relative z-10">Explore Collections</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A90E2] to-[#2E5C8A] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>

            {/* Secondary CTA */}
            <button
              className="group px-10 sm:px-12 py-4 sm:py-5 border-2 border-[#2b2b2b] text-[#2b2b2b] rounded-lg font-inter font-medium text-base sm:text-lg tracking-wide transition-all duration-500 hover:bg-[#2b2b2b] hover:text-white hover:shadow-lg relative overflow-hidden"
              style={{ letterSpacing: "0.12em" }}
            >
              <span className="relative z-10">New Arrivals</span>
            </button>
          </div>

          {/* Trust badges */}
          <div
            className="pt-8 flex justify-center gap-8 text-[#8c8c8c] text-sm font-inter flex-wrap"
            style={{ letterSpacing: "0.05em" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[#4A90E2]">✓</span> Curated Collections
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#4A90E2]">✓</span> Premium Quality
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#4A90E2]">✓</span> Expert Service
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
