"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart()

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = subtotal > 2000 ? 0 : 299
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-300 mb-8">
              Start shopping to fill your cart with beautiful furnishings
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#4A90E2] text-white font-semibold hover:bg-[#3A7BC8] transition-all border-2 border-[#4A90E2]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 md:mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#1a1a1a] rounded border border-white/10 divide-y divide-white/10">
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-6 md:p-8 flex gap-6 border-l-4 ${variant ? colors.border : 'border-l-gray-700'}`}
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className={`relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-[#2d2d2d] rounded-lg border-2 ${variant ? colors.borderColor : 'border-white/10'}`}
                    >
                      <Image
                        src={item.product.images[0]?.src || "/placeholder.svg"}
                        alt={item.product.title}
                        fill
                        className="object-cover hover:scale-110 transition-transform"
                      />
                      {variant && (
                        <div className={`absolute top-0 right-0 w-4 h-4 ${colors.bg} rounded-bl-lg border-l ${colors.borderColor} border-b`}></div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-lg font-semibold text-white hover:text-[#4A90E2] transition-colors mb-2 block"
                        >
                          {item.product.title}
                        </Link>
                        
                        {/* Variant Badge */}
                        {variant && (
                          <div className={`mb-3 px-3 py-1.5 ${colors.bg} rounded-lg border ${colors.borderColor} inline-block`}>
                            <div className="flex items-center gap-1.5">
                              <svg className={`w-4 h-4 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span className={`text-sm font-semibold ${colors.text} uppercase tracking-wide`}>
                                {variant.name}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <p className="text-lg font-bold text-white mb-2">{formatPrice(item.product.price / 100)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center border-2 ${variant ? colors.borderColor : 'border-white/20'} rounded-lg overflow-hidden`}>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="p-2 text-white hover:bg-white/10 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-6 py-2 font-semibold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="p-2 text-white hover:bg-white/10 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="text-right">
                          <p className="text-sm text-gray-400 mb-2">
                            {formatPrice((item.product.price * item.quantity) / 100)}
                          </p>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/products"
                className="text-[#4A90E2] font-medium hover:text-[#3A7BC8] transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-[#1a1a1a] rounded border border-white/10 p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal / 100)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-[#7CB342] font-semibold">Free</span>
                    ) : (
                      formatPrice(shipping / 100)
                    )}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-[#7CB342] font-medium">Congratulations! Free shipping applied.</p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between font-bold text-lg text-white">
                  <span>Total</span>
                  <span>{formatPrice(total / 100)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full px-6 py-3 bg-[#4A90E2] text-white font-semibold hover:bg-[#3A7BC8] transition-all border-2 border-[#4A90E2] mb-3 block text-center"
              >
                Proceed to Checkout
              </Link>

              <div className="bg-[#2d2d2d] p-4 rounded text-sm text-gray-300">
                <p className="font-medium text-white mb-2">Free Shipping Threshold</p>
                <p>
                  {subtotal < 2000
                    ? `Add ${formatPrice((2000 - subtotal) / 100)} more to get free shipping`
                    : "You have qualified for free shipping!"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
