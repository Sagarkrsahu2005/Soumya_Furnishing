"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"

type DeliveryStatus = "order-placed" | "processing" | "shipped" | "out-for-delivery" | "delivered"

interface TrackingData {
  orderId: string
  awbNumber: string
  status: DeliveryStatus
  currentLocation: string
  estimatedDelivery: string
  timeline: {
    status: string
    location: string
    timestamp: string
    description: string
  }[]
  shippingDetails: {
    from: string
    to: string
    courierName: string
    courierPhone: string
  }
}

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingNumber.trim()) {
      setError("Please enter an order ID or tracking number")
      return
    }

    setIsLoading(true)
    setError("")
    setTrackingData(null)

    // Simulate API call - Replace with actual Delhivery API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock data - In production, this would come from your backend which calls Delhivery API
    const mockData: TrackingData = {
      orderId: trackingNumber,
      awbNumber: "DLV" + trackingNumber.slice(-8),
      status: "shipped",
      currentLocation: "Mumbai Distribution Center",
      estimatedDelivery: "17 Jan 2026",
      timeline: [
        {
          status: "Order Placed",
          location: "Soumya Furnishings",
          timestamp: "14 Jan 2026, 10:30 AM",
          description: "Your order has been confirmed",
        },
        {
          status: "Processing",
          location: "Warehouse - Mumbai",
          timestamp: "14 Jan 2026, 02:45 PM",
          description: "Order is being packed",
        },
        {
          status: "Shipped",
          location: "Mumbai Hub",
          timestamp: "15 Jan 2026, 09:15 AM",
          description: "Package picked up by Delhivery",
        },
        {
          status: "In Transit",
          location: "Mumbai Distribution Center",
          timestamp: "15 Jan 2026, 03:30 PM",
          description: "Package is on the way to your city",
        },
      ],
      shippingDetails: {
        from: "Mumbai, Maharashtra",
        to: "Pune, Maharashtra",
        courierName: "Delhivery",
        courierPhone: "+91 9876543210",
      },
    }

    setTrackingData(mockData)
    setIsLoading(false)
  }

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case "order-placed":
        return <Package className="w-6 h-6" />
      case "processing":
        return <Clock className="w-6 h-6" />
      case "shipped":
      case "out-for-delivery":
        return <Truck className="w-6 h-6" />
      case "delivered":
        return <CheckCircle className="w-6 h-6" />
      default:
        return <Package className="w-6 h-6" />
    }
  }

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case "order-placed":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      case "shipped":
        return "bg-orange-500"
      case "out-for-delivery":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: DeliveryStatus) => {
    switch (status) {
      case "order-placed":
        return "Order Placed"
      case "processing":
        return "Processing"
      case "shipped":
        return "Shipped"
      case "out-for-delivery":
        return "Out for Delivery"
      case "delivered":
        return "Delivered"
      default:
        return "Unknown"
    }
  }

  return (
    <main className="min-h-screen bg-brand-ivory">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">Track Your Order</h1>
          <p className="text-lg text-brand-charcoal/70">
            Enter your order ID or tracking number to get real-time updates
          </p>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded border border-brand-sand/30 p-6 md:p-8 mb-8"
        >
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Order ID or Tracking Number
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value)
                    setError("")
                  }}
                  placeholder="e.g., ORD-1234567890 or DLV12345678"
                  className="flex-1 px-4 py-3 border-2 border-brand-sand focus:border-accent-gold outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Tracking...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">Track</span>
                    </>
                  )}
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            <p className="text-xs text-brand-charcoal/60">
              You can find your order ID in the confirmation email we sent you
            </p>
          </form>
        </motion.div>

        {/* Tracking Results */}
        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white rounded border border-brand-sand/30 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full ${getStatusColor(trackingData.status)} flex items-center justify-center text-white`}>
                  {getStatusIcon(trackingData.status)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-brand-charcoal mb-1">
                    {getStatusText(trackingData.status)}
                  </h2>
                  <p className="text-brand-charcoal/70">
                    Current Location: <span className="font-semibold">{trackingData.currentLocation}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-brand-sand/30">
                <div>
                  <p className="text-sm text-brand-charcoal/60 mb-1">Order ID</p>
                  <p className="font-mono font-semibold text-brand-charcoal">{trackingData.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-charcoal/60 mb-1">AWB Number</p>
                  <p className="font-mono font-semibold text-brand-charcoal">{trackingData.awbNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-charcoal/60 mb-1">Est. Delivery</p>
                  <p className="font-semibold text-accent-gold">{trackingData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded border border-brand-sand/30 p-6 md:p-8">
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-brand-charcoal/60 mb-1">From</p>
                      <p className="font-semibold text-brand-charcoal">{trackingData.shippingDetails.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-brand-charcoal/60 mb-1">To</p>
                      <p className="font-semibold text-brand-charcoal">{trackingData.shippingDetails.to}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <Truck className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-brand-charcoal/60 mb-1">Courier Partner</p>
                      <p className="font-semibold text-brand-charcoal">{trackingData.shippingDetails.courierName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-brand-charcoal/60 mb-1">Contact</p>
                      <a
                        href={`tel:${trackingData.shippingDetails.courierPhone}`}
                        className="font-semibold text-accent-gold hover:underline"
                      >
                        {trackingData.shippingDetails.courierPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded border border-brand-sand/30 p-6 md:p-8">
              <h3 className="text-lg font-bold text-brand-charcoal mb-6">Tracking Timeline</h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-sand/50" />

                {/* Timeline Items */}
                <div className="space-y-6">
                  {trackingData.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-12"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>

                      {/* Content */}
                      <div className="bg-brand-sand/10 rounded p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-semibold text-brand-charcoal">{item.status}</h4>
                          <span className="text-sm text-brand-charcoal/60 whitespace-nowrap">{item.timestamp}</span>
                        </div>
                        <p className="text-sm text-brand-charcoal/70 mb-1">{item.description}</p>
                        <p className="text-xs text-brand-charcoal/50 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-accent-gold/5 rounded border border-accent-gold/20 p-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-accent-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-brand-charcoal mb-2">Need Help?</h3>
                  <p className="text-sm text-brand-charcoal/70 mb-3">
                    If you have any questions about your order or delivery, our support team is here to help.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a href="mailto:support@soumyafurnishings.com" className="text-accent-gold font-medium hover:underline">
                      support@soumyafurnishings.com
                    </a>
                    <span className="text-brand-charcoal/30">|</span>
                    <a href="tel:+911234567890" className="text-accent-gold font-medium hover:underline">
                      +91 12345 67890
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  )
}
