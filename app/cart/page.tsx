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
              {items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.variantId}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 md:p-8 flex gap-6"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-[#2d2d2d]"
                  >
                    <Image
                      src={item.product.images[0]?.src || "/placeholder.svg"}
                      alt={item.product.title}
                      fill
                      className="object-cover hover:scale-110 transition-transform"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-lg font-semibold text-white hover:text-[#4A90E2] transition-colors mb-2"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-lg font-bold text-white mb-2">{formatPrice(item.product.price / 100)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border-2 border-white/20">
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
              ))}
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
