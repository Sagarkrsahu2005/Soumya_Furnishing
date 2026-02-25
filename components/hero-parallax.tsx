"use client"

import { useEffect, useRef } from "react"

export default function HeroParallax() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Full Screen Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/ad-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  )
}
