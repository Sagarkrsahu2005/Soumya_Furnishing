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
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 shadow-lg overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-brand-sand/30 p-4 md:p-6 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-brand-charcoal">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-sand/20 rounded transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-brand-charcoal" />
              </button>
            </div>

            {/* Cart Items */}
            {items.length > 0 ? (
              <>
                <div className="p-4 md:p-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4 pb-4 border-b border-brand-sand/30 last:border-0"
                    >
                      {/* Image */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-brand-sand/30"
                      >
                        <Image
                          src={item.product.images[0]?.src || "/placeholder.svg?key=crts"}
                          alt={item.product.title}
                          fill
                          className="object-cover hover:scale-110 transition-transform"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="block text-sm font-semibold text-brand-charcoal hover:text-accent-gold transition-colors truncate mb-2"
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-sm font-bold text-brand-charcoal mb-2">{formatPrice(item.product.price)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-brand-sand/20 rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-brand-sand/20 rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="p-2 text-brand-charcoal hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="sticky bottom-0 bg-brand-ivory border-t border-brand-sand/30 p-4 md:p-6 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-brand-charcoal/70">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-brand-charcoal/70">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-accent-gold font-semibold">Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    {shipping === 0 && <p className="text-xs text-accent-gold">Free shipping applied!</p>}
                  </div>

                  <div className="border-t border-brand-sand/30 pt-4">
                    <div className="flex justify-between font-bold text-lg text-brand-charcoal mb-4">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <Link
                      href="/checkout"
                      className="w-full px-4 py-3 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold mb-2 block text-center"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-3 border-2 border-brand-sand text-brand-charcoal hover:bg-brand-sand/10 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-brand-sand mb-4" />
                <h3 className="text-lg font-semibold text-brand-charcoal mb-2">Your cart is empty</h3>
                <p className="text-brand-charcoal/60 mb-6">Start shopping to add items to your cart</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold"
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
