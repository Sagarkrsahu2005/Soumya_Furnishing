"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroParallax() {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Force video to play on iOS/Safari
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play was prevented, user interaction required
      })
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[100dvh] bg-black"
    >
      {/* Full Screen Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/ad-video-hq.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Audio Control Button - Responsive positioning */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={toggleMute}
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-30 p-3 md:p-4 bg-black/40 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-black/60 active:scale-95 transition-all shadow-xl group touch-manipulation"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
        ) : (
          <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
        )}
        {!isMobile && (
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {isMuted ? "Click to unmute" : "Click to mute"}
          </span>
        )}
      </motion.button>
    </section>
  )
}
