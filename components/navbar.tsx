"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, X, Bed, Sparkles, UtensilsCrossed, Sofa, Flower2, Tag, ChevronRight, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { CartSheet } from "@/components/cart-sheet"
import { Menu, MenuItem, HoveredLink, ProductItem } from "@/components/ui/navbar-menu"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { items } = useCart()
  const { data: session, status } = useSession()
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
        "fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"
      )}>
        <div className="flex items-center justify-center px-2">
          <Menu setActive={setActive}>
            {/* Logo - Responsive sizing */}
            <Link href="/" className="flex-shrink-0 mr-3 md:mr-5 touch-manipulation">
              <Image
                src="/logo.webp"
                alt="Soumya Furnishings"
                width={110}
                height={40}
                className="h-6 md:h-8 w-auto"
                priority
              />
            </Link>
              
              <MenuItem setActive={setActive} active={active} item="Shop">
                <div className="flex flex-col space-y-3 text-sm w-56">
                  <HoveredLink href="/products">All Products</HoveredLink>
                  <div className="border-t border-white/10 my-2"></div>
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
                      <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-[#4A90E2] transition-colors">
                        <span>Bedding</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">9 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-white/20 pl-3">
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
                      <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-[#4A90E2] transition-colors">
                        <span>Curtains & Drapes</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">7 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-white/20 pl-3">
                      <HoveredLink href="/collections/curtains">All Curtains</HoveredLink>
                      <HoveredLink href="/collections/plain-curtains">Plain Curtains</HoveredLink>
                      <HoveredLink href="/collections/printed-curtains">Printed Curtains</HoveredLink>
                      <HoveredLink href="/collections/linen-voile">Linen Voile</HoveredLink>
                      <HoveredLink href="/collections/shear-curtains-plain">Sheer Plain</HoveredLink>
                      <HoveredLink href="/collections/shear-curtains-embroidery">Sheer Embroidery</HoveredLink>
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
                      <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-[#4A90E2] transition-colors">
                        <span>Table Linen</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">7 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-white/20 pl-3">
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
                      <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-[#4A90E2] transition-colors">
                        <span>Living Room</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">4 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-white/20 pl-3">
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
                      <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-[#4A90E2] transition-colors">
                        <span>Kitchen</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">5 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-white/20 pl-3">
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
                      <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-[#4A90E2] transition-colors">
                        <span>Rugs & Mats</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">5 Collections</p>
                    </Link>
                    <div className="ml-4 space-y-2 text-sm border-l-2 border-white/20 pl-3">
                      <HoveredLink href="/collections/rugs">Rugs</HoveredLink>
                      <HoveredLink href="/collections/round-rugs">Round Rugs</HoveredLink>
                      <HoveredLink href="/collections/jute-door-mat">Door Mats</HoveredLink>
                      <HoveredLink href="/collections/yoga-mat">Yoga Mats</HoveredLink>
                    </div>
                  </div>

                  {/* Special Collections */}
                  <div className="col-span-2 pt-6 mt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6">
                        <Link 
                          href="/collections/best-seller"
                          className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#4A90E2] transition-colors"
                          onClick={() => setActive(null)}
                        >
                          <Tag className="w-4 h-4" />
                          <span>Best Sellers</span>
                        </Link>
                        <Link 
                          href="/collections/new"
                          className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#4A90E2] transition-colors"
                          onClick={() => setActive(null)}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>New Arrivals</span>
                        </Link>
                        <Link 
                          href="/collections/christmas"
                          className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#4A90E2] transition-colors"
                          onClick={() => setActive(null)}
                        >
                          <span>Christmas</span>
                        </Link>
                      </div>
                      <Link 
                        href="/products"
                        className="text-sm font-medium text-[#4A90E2] hover:text-[#5AA5E8] transition-colors"
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
              
              {/* Account Menu */}
              {session?.user ? (
                <MenuItem setActive={setActive} active={active} item="Account">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/account">My Orders</HoveredLink>
                    <HoveredLink href="/account/profile">Profile</HoveredLink>
                    <HoveredLink href="/account/addresses">Addresses</HoveredLink>
                  </div>
                </MenuItem>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white hover:text-[#4A90E2] transition-colors"
                >
                  <img 
                    src="https://img.icons8.com/?size=100&id=11727&format=png&color=ffffff" 
                    alt="Login" 
                    className="w-5 h-5"
                  />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}
              
              {/* Cart Button inside menu */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-1.5 md:p-2 text-white hover:text-[#4A90E2] active:scale-95 transition-all ml-2 md:ml-4 touch-manipulation"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-[#4A90E2] rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </Menu>
        </div>
      </div>

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
