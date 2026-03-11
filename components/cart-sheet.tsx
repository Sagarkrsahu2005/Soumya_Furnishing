"use client"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart()

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = subtotal > 2000 ? 0 : 299
  const total = subtotal + shipping

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-[#0f0f0f] z-50 shadow-2xl overflow-y-auto border-l border-white/10"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-white/10 p-4 md:p-6 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-white">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Cart Items */}
            {items.length > 0 ? (
              <>
                <div className="p-4 md:p-6 space-y-4">
                  {items.map((item) => {
                    // Get variant if exists
                    const variant = item.variantId 
                      ? item.product.variants?.find(v => v.id === item.variantId)
                      : null
                    
                    // Generate unique color for each variant
                    const variantColors = [
                      { border: 'border-l-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400', borderColor: 'border-emerald-500/30' },
                      { border: 'border-l-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400', borderColor: 'border-blue-500/30' },
                      { border: 'border-l-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400', borderColor: 'border-purple-500/30' },
                      { border: 'border-l-pink-500', bg: 'bg-pink-500/10', text: 'text-pink-400', borderColor: 'border-pink-500/30' },
                      { border: 'border-l-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400', borderColor: 'border-orange-500/30' },
                      { border: 'border-l-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-400', borderColor: 'border-yellow-500/30' },
                      { border: 'border-l-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-400', borderColor: 'border-cyan-500/30' },
                      { border: 'border-l-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-400', borderColor: 'border-rose-500/30' },
                    ]
                    
                    // Hash variant ID to get consistent color
                    const colorIndex = variant 
                      ? variant.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % variantColors.length
                      : 0
                    const colors = variantColors[colorIndex]
                    
                    return (
                      <motion.div
                        key={`${item.productId}-${item.variantId}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex gap-4 pb-4 border-b border-white/10 last:border-0 pl-3 border-l-4 ${variant ? colors.border : 'border-l-gray-700'}`}
                      >
                        {/* Image */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          className={`relative w-20 h-20 flex-shrink-0 overflow-hidden bg-[#1a1a1a] rounded-lg border-2 ${variant ? colors.borderColor : 'border-white/10'}`}
                        >
                          <Image
                            src={item.product.images[0]?.src || "/placeholder.svg?key=crts"}
                            alt={item.product.title}
                            fill
                            className="object-cover hover:scale-110 transition-transform"
                          />
                          {variant && (
                            <div className={`absolute top-0 right-0 w-3 h-3 ${colors.bg} rounded-bl-lg border-l ${colors.borderColor} border-b`}></div>
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="block text-sm font-semibold text-white hover:text-[#4A90E2] transition-colors truncate mb-1"
                          >
                            {item.product.title}
                          </Link>
                          
                          {/* Variant Badge */}
                          {variant && (
                            <div className={`mb-2 px-2 py-1 ${colors.bg} rounded-md border ${colors.borderColor} inline-block`}>
                              <div className="flex items-center gap-1">
                                <svg className={`w-3 h-3 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
                                  {variant.name}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-sm font-bold text-gray-300 mb-2">{formatPrice(item.product.price / 100)}</p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-lg p-1 w-fit">
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                              className="p-1 hover:bg-white/10 rounded transition-colors text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                              className="p-1 hover:bg-white/10 rounded transition-colors text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Pricing Summary */}
                <div className="sticky bottom-0 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/10 p-4 md:p-6 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal / 100)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-[#7CB342] font-semibold">Free</span>
                        ) : (
                          formatPrice(shipping / 100)
                        )}
                      </span>
                    </div>
                    {shipping === 0 && <p className="text-xs text-[#7CB342]">Free shipping applied!</p>}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between font-bold text-lg text-white mb-4">
                      <span>Total</span>
                      <span>{formatPrice(total / 100)}</span>
                    </div>
                    <Link
                      href="/checkout"
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] hover:from-[#3A7BC8] hover:to-[#4A90E2] text-white font-semibold transition-all rounded-lg mb-2 block text-center shadow-lg shadow-[#4A90E2]/20"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-3 border border-white/20 text-white hover:bg-white/10 transition-all rounded-lg"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
                <p className="text-gray-400 mb-6">Start shopping to add items to your cart</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] hover:from-[#3A7BC8] hover:to-[#4A90E2] text-white font-semibold transition-all rounded-lg shadow-lg shadow-[#4A90E2]/20"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
