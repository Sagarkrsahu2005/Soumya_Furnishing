"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, Package, Truck, Home, Mail, MapPin, User } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { Suspense, useEffect, useState } from "react"
import Image from "next/image"

interface OrderItem {
  id: string
  title: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product: {
    id: string
    title: string
    images: string[]
  } | null
}

interface OrderDetails {
  id: string
  name: string
  orderNumber: number
  firstName: string
  lastName: string
  email: string
  phone: string
  shippingAddress: {
    line1: string
    line2: string | null
    city: string
    state: string
    postalCode: string
    country: string
  }
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  trackingNumber: string | null
  trackingUrl: string | null
  delhiveryWaybill: string | null
  courierName: string | null
  items: OrderItem[]
  createdAt: string
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")?.replace('#', '') || searchParams.get("orderNumber")
  const total = searchParams.get("total")
  const payment = searchParams.get("payment")
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrderDetails(data.order)
          }
          setLoading(false)
        })
        .catch(error => {
          console.error('Failed to fetch order details:', error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [orderId])

  const paymentMethodNames: Record<string, string> = {
    cod: "Cash on Delivery",
    upi: "UPI Payment",
    card: "Card Payment",
  }

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <CheckCircle className="w-24 h-24 text-[#7CB342]" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-300 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-gray-400">
            You'll receive a confirmation email shortly with your order details
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f0f0f] rounded-2xl border border-white/10 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6">Order Details</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading order details...</p>
            </div>
          ) : orderDetails ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Number</p>
                  <p className="font-mono font-semibold text-white text-lg">{orderDetails.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Total</p>
                  <p className="font-semibold text-white text-lg">
                    {formatPrice(orderDetails.total / 100)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                  <p className="font-semibold text-white">
                    {paymentMethodNames[orderDetails.paymentMethod] || orderDetails.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Estimated Delivery</p>
                  <p className="font-semibold text-white">
                    {estimatedDelivery.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">via {orderDetails.courierName || 'Delhivery'}</p>
                </div>

                {orderDetails.delhiveryWaybill && (
                  <>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Tracking Number</p>
                      <p className="font-mono font-semibold text-[#4A90E2]">{orderDetails.delhiveryWaybill}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Track Shipment</p>
                      {orderDetails.trackingUrl ? (
                        <a 
                          href={orderDetails.trackingUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4A90E2] hover:underline font-semibold inline-flex items-center gap-2"
                        >
                          <Truck className="w-4 h-4" />
                          Track on Delhivery
                        </a>
                      ) : (
                        <Link 
                          href={`/track?order=${orderDetails.name}`}
                          className="text-[#4A90E2] hover:underline font-semibold inline-flex items-center gap-2"
                        >
                          <Package className="w-4 h-4" />
                          Track Order
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Customer & Shipping Info */}
              <div className="border-t border-white/10 pt-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-[#4A90E2]" />
                      <h3 className="font-semibold text-white">Customer</h3>
                    </div>
                    <p className="text-gray-300">{orderDetails.firstName} {orderDetails.lastName}</p>
                    <p className="text-gray-400 text-sm">{orderDetails.email}</p>
                    <p className="text-gray-400 text-sm">{orderDetails.phone}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-[#4A90E2]" />
                      <h3 className="font-semibold text-white">Shipping Address</h3>
                    </div>
                    <p className="text-gray-300">{orderDetails.shippingAddress.line1}</p>
                    {orderDetails.shippingAddress.line2 && (
                      <p className="text-gray-300">{orderDetails.shippingAddress.line2}</p>
                    )}
                    <p className="text-gray-300">
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-300">{orderDetails.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#4A90E2]" />
                  Items Ordered ({orderDetails.items.length})
                </h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-white/5 last:border-0">
                      {item.product?.images[0] && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{item.title}</h4>
                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-white">{formatPrice(item.totalPrice / 100)}</p>
                        <p className="text-xs text-gray-500">{formatPrice(item.unitPrice / 100)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderDetails.subtotal / 100)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{formatPrice(orderDetails.shipping / 100)}</span>
                  </div>
                </div>
                
                {/* Tax Note */}
                <div className="mb-4 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-xs text-emerald-400 text-center font-medium">✓ All taxes included in product prices</p>
                </div>
                
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(orderDetails.total / 100)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Order Number</p>
                <p className="font-mono font-semibold text-white">{orderId || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Order Total</p>
                <p className="font-semibold text-white text-lg">
                  {total ? formatPrice(Number(total) / 100) : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                <p className="font-semibold text-white">
                  {payment ? paymentMethodNames[payment] || payment : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Estimated Delivery</p>
                <p className="font-semibold text-white">
                  {estimatedDelivery.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">via Delhivery</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0f0f0f] rounded-2xl border border-white/10 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6">What's Next?</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[#4A90E2]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Order Confirmation Email</h3>
                <p className="text-sm text-gray-400">
                  We've sent a confirmation email with your order details. Please check your inbox.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#7CB342]/20 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-[#7CB342]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Order Processing</h3>
                <p className="text-sm text-gray-400">
                  Your order is being carefully prepared. We'll notify you once it's ready for shipment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#4A90E2]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Delhivery Tracking</h3>
                <p className="text-sm text-gray-400">
                  Your order will be delivered by Delhivery. Track your shipment and get real-time updates via email and SMS.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href={`/track?order=${orderId}`}
            className="px-8 py-3 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] text-white font-semibold hover:from-[#3A7BC8] hover:to-[#4A90E2] transition-all rounded-lg text-center flex items-center justify-center gap-2 shadow-lg shadow-[#4A90E2]/20"
          >
            <Package className="w-5 h-5" />
            Track Order
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-[#1a1a1a] text-white font-semibold hover:bg-[#2d2d2d] transition-all border border-white/20 rounded-lg text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-[#1a1a1a] text-white font-semibold hover:bg-[#2d2d2d] transition-all border border-white/20 rounded-lg text-center flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>

        {/* Customer Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-400">
            Need help? Contact us at{" "}
            <a href="mailto:support@soumyafurnishings.com" className="text-[#4A90E2] font-medium hover:underline">
              support@soumyafurnishings.com
            </a>{" "}
            or call{" "}
            <a href="tel:+911234567890" className="text-[#4A90E2] font-medium hover:underline">
              +91 12345 67890
            </a>
          </p>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-brand-ivory">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
