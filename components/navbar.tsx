"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { CartSheet } from "@/components/cart-sheet"
import { Menu, MenuItem, HoveredLink, ProductItem } from "@/components/ui/navbar-menu"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { items } = useCart()
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 50)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <>
      {/* Unified Navigation Bar with Logo, Menu, and Cart */}
      <div className={cn(
        "fixed top-10 inset-x-0 max-w-fit mx-auto z-50 transition-transform duration-300 px-4",
        isVisible ? "translate-y-0" : "-translate-y-32"
      )}>
        <div className="flex items-center justify-center">
          {/* Navigation Menu with Logo and Cart inside - Visible on all screens */}
          <div className="w-full">
            <Menu setActive={setActive}>
              {/* Logo inside menu */}
              <Link href="/" className="flex-shrink-0 mr-2 md:mr-4">
                <Image
                  src="/logo.webp"
                  alt="Soumya Furnishings"
                  width={140}
                  height={51}
                  className="h-7 md:h-8 w-auto"
                  priority
                />
              </Link>
              
              <MenuItem setActive={setActive} active={active} item="Shop">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/products">All Products</HoveredLink>
                  <HoveredLink href="/products?category=bedding">Bedding</HoveredLink>
                  <HoveredLink href="/products?category=cushions">Cushions</HoveredLink>
                  <HoveredLink href="/products?category=curtains">Curtains</HoveredLink>
                  <HoveredLink href="/products?category=rugs">Rugs</HoveredLink>
                  <HoveredLink href="/products?category=table-linen">Table Linen</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Collections">
                <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-2 md:p-4">
                  <ProductItem
                    title="Bedroom Collection"
                    href="/products?room=bedroom"
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop"
                    description="Premium bedding and furnishings for your personal sanctuary."
                  />
                  <ProductItem
                    title="Living Room"
                    href="/products?room=living"
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop"
                    description="Elegant pieces to elevate your living space."
                  />
                  <ProductItem
                    title="Dining Collection"
                    href="/products?room=dining"
                    src="https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=400&auto=format&fit=crop"
                    description="Refined table linens and dining essentials."
                  />
                  <ProductItem
                    title="Outdoor Living"
                    href="/products?room=outdoor"
                    src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&auto=format&fit=crop"
                    description="Weather-resistant furnishings for outdoor comfort."
                  />
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="About">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/about">Our Story</HoveredLink>
                  <HoveredLink href="/about#craftsmanship">Craftsmanship</HoveredLink>
                  <HoveredLink href="/about#sustainability">Sustainability</HoveredLink>
                  <HoveredLink href="/about#team">Meet the Team</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Contact">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/contact">Get in Touch</HoveredLink>
                  <HoveredLink href="/contact#stores">Store Locations</HoveredLink>
                  <HoveredLink href="/contact#support">Customer Support</HoveredLink>
                  <HoveredLink href="/contact#trade">Trade Program</HoveredLink>
                </div>
              </MenuItem>
              
              {/* Cart Button inside menu */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-1 md:p-1.5 text-[#2b2b2b] hover:text-[#4A90E2] transition-colors ml-2 md:ml-3"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-[#4A90E2] rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </Menu>
          </div>
        </div>
      </div>

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
