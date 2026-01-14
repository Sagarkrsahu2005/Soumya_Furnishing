"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Minus, ShoppingCart, Check } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/components/toasts"

interface AddToCartProps {
  product: Product
  variantId?: string
}

// Party Popper animation from sides
const PartyPopper = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null
  
  const colors = ['#7CB342', '#558B2F', '#8BC34A', '#FFC107', '#FFD54F', '#FF9800', '#FF5722', '#F44336', '#2196F3', '#64B5F6', '#9C27B0', '#E91E63']
  
  // Create confetti from left side
  const leftConfetti = Array.from({ length: 40 }, (_, i) => ({
    id: `left-${i}`,
    startX: -5,
    startY: 30 + Math.random() * 40,
    angle: -30 + Math.random() * 60, // Shoot towards right
    velocity: 25 + Math.random() * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 1080,
    shape: Math.random() > 0.3 ? 'rect' : 'circle',
    delay: Math.random() * 0.1
  }))
  
  // Create confetti from right side
  const rightConfetti = Array.from({ length: 40 }, (_, i) => ({
    id: `right-${i}`,
    startX: 105,
    startY: 30 + Math.random() * 40,
    angle: 150 + Math.random() * 60, // Shoot towards left
    velocity: 25 + Math.random() * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 1080,
    shape: Math.random() > 0.3 ? 'rect' : 'circle',
    delay: Math.random() * 0.1
  }))
  
  const allConfetti = [...leftConfetti, ...rightConfetti]

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Party Popper Images */}
      <motion.div
        initial={{ x: -100, rotate: -20, scale: 0.8 }}
        animate={{ 
          x: 0,
          rotate: [0, -10, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute left-8 top-1/2 -translate-y-1/2 text-6xl"
      >
        🎉
      </motion.div>
      
      <motion.div
        initial={{ x: 100, rotate: 20, scale: 0.8 }}
        animate={{ 
          x: 0,
          rotate: [0, 10, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute right-8 top-1/2 -translate-y-1/2 text-6xl"
      >
        🎉
      </motion.div>
      
      {/* Confetti particles */}
      {allConfetti.map((piece) => {
        const endX = piece.startX + Math.cos(piece.angle * Math.PI / 180) * piece.velocity
        const endY = piece.startY + Math.sin(piece.angle * Math.PI / 180) * piece.velocity + 30
        
        return (
          <motion.div
            key={piece.id}
            initial={{ 
              left: `${piece.startX}vw`,
              top: `${piece.startY}vh`,
              opacity: 0,
              scale: 0,
              rotate: piece.rotation
            }}
            animate={{
              left: `${endX}vw`,
              top: `${endY}vh`,
              opacity: [0, 1, 1, 0.7, 0],
              scale: [0, 1.2, 1, 1, 0.8],
              rotate: piece.rotation + piece.rotationSpeed
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              delay: piece.delay,
              ease: [0.17, 0.67, 0.35, 0.96]
            }}
            className="absolute"
            style={{
              width: piece.shape === 'rect' ? piece.size * 0.6 : piece.size,
              height: piece.shape === 'rect' ? piece.size * 1.5 : piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.shape === 'circle' ? '50%' : '2px',
              boxShadow: `0 0 ${piece.size}px ${piece.color}60`
            }}
          />
        )
      })}
      
      {/* Sparkles */}
      {Array.from({ length: 30 }, (_, i) => {
        const fromLeft = i < 15
        const startX = fromLeft ? 10 : 90
        const startY = 40 + Math.random() * 20
        
        return (
          <motion.div
            key={`star-${i}`}
            initial={{
              left: `${startX}vw`,
              top: `${startY}vh`,
              opacity: 0,
              scale: 0
            }}
            animate={{
              left: `${startX + (fromLeft ? 1 : -1) * (10 + Math.random() * 20)}vw`,
              top: `${startY + (Math.random() - 0.5) * 20}vh`,
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1.2, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              delay: 0.1 + Math.random() * 0.2,
              ease: "easeOut"
            }}
            className="absolute text-yellow-400"
            style={{ fontSize: '20px' }}
          >
            ✨
          </motion.div>
        )
      })}
      
      {/* Celebration text */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          y: [20, 0, 0, -10],
          scale: [0.8, 1.1, 1, 0.9]
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7CB342] to-[#558B2F] pointer-events-none"
      >
        Added! 🎊
      </motion.div>
    </div>
  )
}

export function AddToCart({ product, variantId }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [lastTrigger, setLastTrigger] = useState(0)
  const { addItem } = useCart()
  const { addToast } = useToast()

  const handleAddToCart = () => {
    // Throttle animation to prevent spam
    const now = Date.now()
    if (now - lastTrigger < 3000) {
      // Still add to cart, just skip animation
      addItem(product, variantId, quantity)
      addToast(`${product.title} added to cart!`, "success", 3000)
      return
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    addItem(product, variantId, quantity)
    setIsAdded(true)
    setLastTrigger(now)
    
    if (!prefersReducedMotion) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 1200)
    }
    
    addToast(`${product.title} added to cart!`, "success", 3000)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      <PartyPopper isActive={showCelebration} />
      
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-brand-charcoal">Quantity:</span>
        <div className="flex items-center border-2 border-brand-sand rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 text-brand-charcoal hover:bg-brand-sand/30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-2 font-semibold text-brand-charcoal min-w-16 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 text-brand-charcoal hover:bg-brand-sand/30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <motion.button
        onClick={handleAddToCart}
        className={`w-full py-4 px-6 font-semibold transition-all duration-300 rounded-lg flex items-center justify-center gap-2 shadow-lg ${
          isAdded
            ? "bg-emerald-600 text-white shadow-emerald-600/30"
            : "bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white hover:shadow-xl hover:shadow-[#7CB342]/30"
        }`}
        whileHover={isAdded ? {} : { scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </motion.button>
    </div>
  )
}
