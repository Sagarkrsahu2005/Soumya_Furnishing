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

    // Background parallax
    gsap.to(bgRef.current, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        markers: false,
      },
    })

    // Content card subtle parallax (upward)
    gsap.to(contentRef.current, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    })

    // Scroll indicator fade
    const scrollIndicator = document.querySelector("[data-scroll-indicator]")
    if (scrollIndicator) {
      gsap.to(scrollIndicator, {
        opacity: 0,
        pointerEvents: "none",
        ease: "power2.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top center",
          onUpdate: (self) => {
            gsap.to(scrollIndicator, {
              opacity: 1 - self.getVelocity() / 500,
              overwrite: "auto",
            })
          },
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background with parallax */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f7f5f2] via-[#efe9e3] to-[#f7f5f2]" />

        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8b27c] rounded-full blur-3xl opacity-5" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#9dafa2] rounded-full blur-3xl opacity-5" />
      </div>

      {/* Fixed overlay for text readability */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f7f5f2]/40 pointer-events-none"
      />

      {/* Content card with parallax */}
      <div
        ref={contentRef}
        className="relative z-20 px-4 sm:px-6 lg:px-8 w-full max-w-3xl will-change-transform"
      >
        <div className="space-y-8 text-center">
          {/* Luxury accent line */}
          <div className="flex justify-center">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#c8b27c] to-transparent" />
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-semibold text-[#2b2b2b] leading-tight"
            style={{ letterSpacing: "0.02em" }}
          >
            Elevate Your <span className="text-[#c8b27c] block">Living</span>
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
            <div className="h-px w-16 bg-gradient-to-r from-[#9dafa2] via-[#c8b27c] to-[#9dafa2]" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {/* Primary CTA */}
            <button
              className="group px-10 sm:px-12 py-4 sm:py-5 bg-[#2b2b2b] text-white rounded-lg font-inter font-medium text-base sm:text-lg tracking-wide transition-all duration-500 hover:bg-[#c8b27c] hover:text-[#2b2b2b] hover:shadow-lg relative overflow-hidden"
              style={{ letterSpacing: "0.12em" }}
            >
              <span className="relative z-10">Explore Collections</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#c8b27c] to-[#d9c4a3] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              <span className="text-[#c8b27c]">✓</span> Curated Collections
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c8b27c]">✓</span> Premium Quality
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c8b27c]">✓</span> Expert Service
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-scroll-indicator
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-300"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs sm:text-sm text-[#8c8c8c] font-inter tracking-widest uppercase">
            Scroll to Explore
          </span>
          <div className="flex items-center justify-center animate-bounce">
            <ChevronDown
              className="w-5 h-5 text-[#c8b27c]"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
