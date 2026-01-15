"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, X, Bed, Sparkles, UtensilsCrossed, Sofa, Flower2, Tag, ChevronRight } from "lucide-react"
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
      {/* Backdrop Blur Overlay - Apple Style */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-md"
            onClick={() => setActive(null)}
          />
        )}
      </AnimatePresence>

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
              
              <MenuItem setActive={setActive} active={active} item="Shop by Category">
                <div className="flex flex-col space-y-3 text-sm w-56">
                  <HoveredLink href="/products">All Products</HoveredLink>
                  <div className="border-t border-gray-200 my-2"></div>
                  <HoveredLink href="/collections/bed-linen">Bedding</HoveredLink>
                  <HoveredLink href="/collections/curtains">Curtains & Drapes</HoveredLink>
                  <HoveredLink href="/collections/table-covers">Table Linen</HoveredLink>
                  <HoveredLink href="/collections/cushion">Living Room</HoveredLink>
                  <HoveredLink href="/collections/kitchen-linen">Kitchen</HoveredLink>
                  <HoveredLink href="/collections/rugs">Rugs & Mats</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Collections">
                <div className="grid grid-cols-2 gap-x-12 gap-y-8 p-6 w-[700px]">
                  {/* Bedding Category */}
                  <div className="space-y-3">
                    <Link 
                      href="/collections/bed-linen"
                      className="block group"
                      onClick={() => setActive(null)}
                    >
                      <div className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors">
                        <span>Bedding</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">9 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-gray-100 pl-3">
                      <HoveredLink href="/collections/bed-linen">Bed Linen</HoveredLink>
                      <HoveredLink href="/collections/bed-covers-plain">Bed Covers Plain</HoveredLink>
                      <HoveredLink href="/collections/bed-covers-woven">Bed Covers Woven</HoveredLink>
                      <HoveredLink href="/collections/printed-bedsheets">Printed Bedsheets</HoveredLink>
                      <HoveredLink href="/collections/pillow-cover">Pillow Covers</HoveredLink>
                      <HoveredLink href="/collections/bolster-covers">Bolster Covers</HoveredLink>
                      <HoveredLink href="/collections/comforters">Comforters</HoveredLink>
                    </div>
                  </div>

                  {/* Curtains Category */}
                  <div className="space-y-3">
                    <Link 
                      href="/collections/curtains"
                      className="block group"
                      onClick={() => setActive(null)}
                    >
                      <div className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors">
                        <span>Curtains & Drapes</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">7 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-gray-100 pl-3">
                      <HoveredLink href="/collections/curtains">All Curtains</HoveredLink>
                      <HoveredLink href="/collections/plain-curtains">Plain Curtains</HoveredLink>
                      <HoveredLink href="/collections/printed-curtains">Printed Curtains</HoveredLink>
                      <HoveredLink href="/collections/linen-voile">Linen Voile</HoveredLink>
                      <HoveredLink href="/collections/shear-curtains-plain">Sheer Plain</HoveredLink>
                      <HoveredLink href="/collections/sheer-printed-curtains">Sheer Printed</HoveredLink>
                    </div>
                  </div>

                  {/* Table Linen Category */}
                  <div className="space-y-3">
                    <Link 
                      href="/collections/table-covers"
                      className="block group"
                      onClick={() => setActive(null)}
                    >
                      <div className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors">
                        <span>Table Linen</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">7 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-gray-100 pl-3">
                      <HoveredLink href="/collections/table-covers">Table Covers</HoveredLink>
                      <HoveredLink href="/collections/table-covers-plain">Plain Covers</HoveredLink>
                      <HoveredLink href="/collections/table-covers-printed">Printed Covers</HoveredLink>
                      <HoveredLink href="/collections/table-runner">Table Runners</HoveredLink>
                      <HoveredLink href="/collections/table-napkins">Napkins</HoveredLink>
                      <HoveredLink href="/collections/table-placemats">Placemats</HoveredLink>
                    </div>
                  </div>

                  {/* Living Room Category */}
                  <div className="space-y-3">
                    <Link 
                      href="/collections/cushion"
                      className="block group"
                      onClick={() => setActive(null)}
                    >
                      <div className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors">
                        <span>Living Room</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">4 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-gray-100 pl-3">
                      <HoveredLink href="/collections/cushion">Cushion Covers</HoveredLink>
                      <HoveredLink href="/collections/sofa-cover">Diwan Sets</HoveredLink>
                      <HoveredLink href="/collections/sofa-throws">Sofa Throws</HoveredLink>
                    </div>
                  </div>

                  {/* Kitchen Category */}
                  <div className="space-y-3">
                    <Link 
                      href="/collections/kitchen-linen"
                      className="block group"
                      onClick={() => setActive(null)}
                    >
                      <div className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors">
                        <span>Kitchen</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">5 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-gray-100 pl-3">
                      <HoveredLink href="/collections/kitchen-linen">Kitchen Linen</HoveredLink>
                      <HoveredLink href="/collections/aprons">Aprons</HoveredLink>
                      <HoveredLink href="/collections/oven-mittens">Oven Mittens</HoveredLink>
                      <HoveredLink href="/collections/pot-holder">Pot Holders</HoveredLink>
                    </div>
                  </div>

                  {/* Rugs & Mats Category */}
                  <div className="space-y-3">
                    <Link 
                      href="/collections/rugs"
                      className="block group"
                      onClick={() => setActive(null)}
                    >
                      <div className="flex items-center justify-between text-sm font-bold text-gray-900 group-hover:text-[#7CB342] transition-colors">
                        <span>Rugs & Mats</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">5 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-gray-100 pl-3">
                      <HoveredLink href="/collections/rugs">Rugs</HoveredLink>
                      <HoveredLink href="/collections/round-rugs">Round Rugs</HoveredLink>
                      <HoveredLink href="/collections/jute-door-mat">Door Mats</HoveredLink>
                      <HoveredLink href="/collections/yoga-mat">Yoga Mats</HoveredLink>
                    </div>
                  </div>

                  {/* Special Collections */}
                  <div className="col-span-2 pt-6 mt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6">
                        <Link 
                          href="/collections/best-seller"
                          className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#7CB342] transition-colors"
                          onClick={() => setActive(null)}
                        >
                          <Tag className="w-4 h-4" />
                          <span>Best Sellers</span>
                        </Link>
                        <Link 
                          href="/collections/new"
                          className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#7CB342] transition-colors"
                          onClick={() => setActive(null)}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>New Arrivals</span>
                        </Link>
                        <Link 
                          href="/collections/christmas"
                          className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#7CB342] transition-colors"
                          onClick={() => setActive(null)}
                        >
                          <span>Christmas</span>
                        </Link>
                      </div>
                      <Link 
                        href="/products"
                        className="text-sm font-medium text-[#7CB342] hover:text-[#689F38] transition-colors"
                        onClick={() => setActive(null)}
                      >
                        View All →
                      </Link>
                    </div>
                  </div>
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
