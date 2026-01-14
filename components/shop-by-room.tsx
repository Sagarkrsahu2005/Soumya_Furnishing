"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useSpring } from "framer-motion"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { ArrowUpRight, Sparkles } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const rooms = [
  {
    title: "Bedroom",
    subtitle: "Dreams & Comfort",
    description: "Luxury bedsheets, plush cushions & comfort layers",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1160&auto=format&fit=crop",
    href: "/collections/bedroom",
    accent: "from-amber-500/30 via-orange-500/20 to-transparent",
    size: "large",
  },
  {
    title: "Living Room",
    subtitle: "Style & Elegance",
    description: "Statement cushions & elegant textures",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=627&auto=format&fit=crop",
    href: "/collections/living-room",
    accent: "from-emerald-500/30 via-teal-500/20 to-transparent",
    size: "medium",
  },
  {
    title: "Dining",
    subtitle: "Gather & Celebrate",
    description: "Napkins, runners & hosting essentials",
    image: "https://images.unsplash.com/photo-1616486886892-ff366aa67ba4?q=80&w=1160&auto=format&fit=crop",
    href: "/collections/dining",
    accent: "from-rose-500/30 via-pink-500/20 to-transparent",
    size: "medium",
  },
  {
    title: "Kitchen",
    subtitle: "Cook & Create",
    description: "Table linen & everyday luxury",
    image: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=870&auto=format&fit=crop",
    href: "/collections/kitchen",
    accent: "from-blue-500/30 via-cyan-500/20 to-transparent",
    size: "full",
  },
]

export default function ShopByRoom() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!containerRef.current || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Animate section title with 3D effect
      gsap.from(".section-title", {
        y: 100,
        opacity: 0,
        rotateX: -15,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".section-title",
          start: "top 85%",
        },
      })

      // Staggered card reveals with depth
      gsap.from(".room-card", {
        y: 150,
        opacity: 0,
        scale: 0.9,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".room-grid",
          start: "top 75%",
        },
      })

      // Parallax on images
      gsap.utils.toArray<HTMLElement>(".parallax-image").forEach((img) => {
        gsap.to(img, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x * 0.03)
    mouseY.set(y * 0.03)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-[#fafffe] via-[#f5faf8] to-[#edf7f2]"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-400/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/10 blur-3xl"
        />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Section Header - Editorial Style */}
        <div className="section-title text-center mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#4A90E2]" />
            <span className="text-xs font-semibold tracking-[0.3em] text-[#4A90E2] uppercase">
              Collections
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair text-[#1a1a1a] font-bold mb-6 leading-[1.1] tracking-tight">
            Choose by
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] via-[#7CB342] to-[#4A90E2] bg-[length:200%_auto] animate-gradient">
              Your Space
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-[#5f5f5f] font-light max-w-2xl mx-auto leading-relaxed">
            Thoughtfully curated collections that transform every corner of your home into a sanctuary
          </p>
        </div>

        {/* Asymmetric Bento Grid Layout */}
        <div className="room-grid grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 auto-rows-[400px]">
          {rooms.map((room, idx) => {
            const isLarge = room.size === "large"
            const isMedium = room.size === "medium"
            const isFull = room.size === "full"
            const gridClass = isLarge
              ? "md:col-span-7 md:row-span-2"
              : isMedium
              ? "md:col-span-5"
              : isFull
              ? "md:col-span-12"
              : "md:col-span-5"

            return (
              <motion.div
                key={idx}
                className={`room-card group relative ${gridClass} rounded-[2rem] overflow-hidden cursor-pointer`}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => {
                  handleMouseLeave()
                  setHoveredIndex(null)
                }}
                style={{
                  x: hoveredIndex === idx ? mouseXSpring : 0,
                  y: hoveredIndex === idx ? mouseYSpring : 0,
                  perspective: "1000px",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Multi-layer parallax background */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Base image layer */}
                  <motion.div
                    className="parallax-image absolute inset-0 scale-110"
                    animate={hoveredIndex === idx ? { scale: 1.15 } : { scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src={room.image}
                      alt={room.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      priority={idx < 2}
                    />
                  </motion.div>

                  {/* Gradient overlay - animated on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${room.accent}`}
                    initial={{ opacity: 0.4 }}
                    animate={hoveredIndex === idx ? { opacity: 0.7 } : { opacity: 0.4 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Dark vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                {/* Multi-layer glass effect */}
                <div className="absolute inset-0">
                  {/* Outer glass layer */}
                  <motion.div
                    className="absolute inset-0 backdrop-blur-[2px] bg-white/5"
                    animate={hoveredIndex === idx ? { backdropFilter: "blur(0px)" } : {}}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-[2rem] border border-white/20"
                    animate={hoveredIndex === idx ? { borderColor: "rgba(255, 255, 255, 0.4)" } : {}}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Content - Editorial Layout */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
                  {/* Top badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="self-start"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/30 shadow-xl">
                      <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                      <span className="text-[10px] font-semibold tracking-[0.2em] text-white/90 uppercase">
                        {room.subtitle}
                      </span>
                    </div>
                  </motion.div>

                  {/* Bottom content */}
                  <div className="space-y-6">
                    {/* Glass card */}
                    <motion.div
                      className="backdrop-blur-2xl bg-white/10 rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl"
                      animate={hoveredIndex === idx ? { y: -10, backgroundColor: "rgba(255, 255, 255, 0.15)" } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white font-bold mb-3 tracking-tight leading-none">
                        {room.title}
                      </h3>
                      <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">
                        {room.description}
                      </p>
                    </motion.div>

                    {/* CTA Button */}
                    <Link href={room.href}>
                      <motion.button
                        className="group/btn relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#2b2b2b] font-semibold text-sm tracking-wide overflow-hidden"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Button gradient overlay on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#4A90E2] to-[#7CB342] opacity-0 group-hover/btn:opacity-100"
                          transition={{ duration: 0.3 }}
                        />
                        
                        <span className="relative z-10 group-hover/btn:text-white transition-colors">
                          Explore Collection
                        </span>
                        <ArrowUpRight className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 group-hover/btn:text-white transition-all duration-300" />
                      </motion.button>
                    </Link>
                  </div>
                </div>

                {/* Hover shine effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
                  }}
                  animate={hoveredIndex === idx ? {
                    background: [
                      "radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
                    ],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Add gradient animation keyframes */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </section>
  )
}
