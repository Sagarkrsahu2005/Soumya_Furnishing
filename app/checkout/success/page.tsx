"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, Package, Truck, Home, Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { Suspense } from "react"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const total = searchParams.get("total")
  const payment = searchParams.get("payment")

  const paymentMethodNames: Record<string, string> = {
    cod: "Cash on Delivery",
    upi: "UPI Payment",
    card: "Card Payment",
  }

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  return (
    <main className="min-h-screen bg-brand-ivory">
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
            <CheckCircle className="w-24 h-24 text-accent-gold" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">Order Confirmed!</h1>
          <p className="text-lg text-brand-charcoal/70 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-brand-charcoal/60">
            You'll receive a confirmation email shortly with your order details
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded border border-brand-sand/30 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-brand-charcoal mb-6">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-brand-charcoal/60 mb-1">Order Number</p>
              <p className="font-mono font-semibold text-brand-charcoal">{orderId}</p>
            </div>

            <div>
              <p className="text-sm text-brand-charcoal/60 mb-1">Order Total</p>
              <p className="font-semibold text-brand-charcoal text-lg">
                {total ? formatPrice(Number(total)) : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-brand-charcoal/60 mb-1">Payment Method</p>
              <p className="font-semibold text-brand-charcoal">
                {payment ? paymentMethodNames[payment] || payment : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-brand-charcoal/60 mb-1">Estimated Delivery</p>
              <p className="font-semibold text-brand-charcoal">
                {estimatedDelivery.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-brand-charcoal/50 mt-1">via Delhivery</p>
            </div>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded border border-brand-sand/30 p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-brand-charcoal mb-6">What's Next?</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-accent-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-charcoal mb-1">Order Confirmation Email</h3>
                <p className="text-sm text-brand-charcoal/70">
                  We've sent a confirmation email with your order details. Please check your inbox.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-accent-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-charcoal mb-1">Order Processing</h3>
                <p className="text-sm text-brand-charcoal/70">
                  Your order is being carefully prepared. We'll notify you once it's ready for shipment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-accent-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-charcoal mb-1">Delhivery Tracking</h3>
                <p className="text-sm text-brand-charcoal/70">
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
            className="px-8 py-3 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold text-center flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Track Order
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-white text-brand-charcoal font-semibold hover:bg-brand-sand/20 transition-all border-2 border-brand-sand text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-white text-brand-charcoal font-semibold hover:bg-brand-sand/20 transition-all border-2 border-brand-sand text-center flex items-center justify-center gap-2"
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
          <p className="text-sm text-brand-charcoal/60">
            Need help? Contact us at{" "}
            <a href="mailto:support@soumyafurnishings.com" className="text-accent-gold font-medium hover:underline">
              support@soumyafurnishings.com
            </a>{" "}
            or call{" "}
            <a href="tel:+911234567890" className="text-accent-gold font-medium hover:underline">
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
