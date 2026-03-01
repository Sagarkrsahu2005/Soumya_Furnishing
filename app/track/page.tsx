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

    try {
      // Call tracking API with either waybill or orderId
      const paramName = trackingNumber.startsWith('DLV') || trackingNumber.startsWith('TEST') ? 'waybill' : 'orderId'
      const encodedValue = encodeURIComponent(trackingNumber.trim())
      const response = await fetch(
        `/api/shipping/track?${paramName}=${encodedValue}`
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || "Unable to track shipment. Please check your tracking number and try again.")
        setIsLoading(false)
        return
      }

      // Map API response to our TrackingData format
      const mapStatusToDeliveryStatus = (status: string): DeliveryStatus => {
        const statusLower = status.toLowerCase()
        if (statusLower.includes('placed') || statusLower.includes('booked')) return 'order-placed'
        if (statusLower.includes('processing') || statusLower.includes('manifest')) return 'processing'
        if (statusLower.includes('shipped') || statusLower.includes('dispatch')) return 'shipped'
        if (statusLower.includes('out for delivery')) return 'out-for-delivery'
        if (statusLower.includes('delivered')) return 'delivered'
        return 'shipped'
      }

      const trackingData: TrackingData = {
        orderId: data.orderId || trackingNumber,
        awbNumber: data.waybill,
        status: mapStatusToDeliveryStatus(data.status.status),
        currentLocation: data.status.currentLocation || 'In Transit',
        estimatedDelivery: data.status.estimatedDelivery 
          ? new Date(data.status.estimatedDelivery).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })
          : 'TBD',
        timeline: data.timeline || [],
        shippingDetails: {
          from: 'Mumbai, Maharashtra',
          to: data.status.currentLocation || 'Destination',
          courierName: 'Delhivery',
          courierPhone: '+91 9876543210',
        },
      }

      setTrackingData(trackingData)
    } catch (err) {
      console.error('Tracking error:', err)
      setError("Failed to fetch tracking information. Please try again later.")
    } finally {
      setIsLoading(false)
    }
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
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-400">
            Enter your order ID or tracking number to get real-time updates
          </p>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f0f0f] rounded-2xl border border-white/10 p-6 md:p-8 mb-8"
        >
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
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
                  placeholder="e.g., 1001, #TEST001 or TEST123456789"
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-500 focus:border-[#4A90E2] outline-none transition-colors rounded-lg"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] text-white font-semibold hover:opacity-90 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>

            <p className="text-xs text-gray-500">
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
            <div className="bg-[#0f0f0f] rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full ${getStatusColor(trackingData.status)} flex items-center justify-center text-white`}>
                  {getStatusIcon(trackingData.status)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {getStatusText(trackingData.status)}
                  </h2>
                  <p className="text-gray-400">
                    Current Location: <span className="font-semibold text-white">{trackingData.currentLocation}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono font-semibold text-white">{trackingData.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">AWB Number</p>
                  <p className="font-mono font-semibold text-white">{trackingData.awbNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Est. Delivery</p>
                  <p className="font-semibold text-[#4A90E2]">{trackingData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-[#0f0f0f] rounded-2xl border border-white/10 p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-4">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">From</p>
                      <p className="font-semibold text-white">{trackingData.shippingDetails.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">To</p>
                      <p className="font-semibold text-white">{trackingData.shippingDetails.to}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <Truck className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Courier Partner</p>
                      <p className="font-semibold text-white">{trackingData.shippingDetails.courierName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Contact</p>
                      <a
                        href={`tel:${trackingData.shippingDetails.courierPhone}`}
                        className="font-semibold text-[#4A90E2] hover:underline"
                      >
                        {trackingData.shippingDetails.courierPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#0f0f0f] rounded-2xl border border-white/10 p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-6">Tracking Timeline</h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />

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
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-[#4A90E2] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>

                      {/* Content */}
                      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-semibold text-white">{item.status}</h4>
                          <span className="text-sm text-gray-500 whitespace-nowrap">{item.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{item.description}</p>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
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
            <div className="bg-[#4A90E2]/10 rounded-2xl border border-[#4A90E2]/20 p-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#4A90E2] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    If you have any questions about your order or delivery, our support team is here to help.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a href="mailto:support@soumyafurnishings.com" className="text-[#4A90E2] font-medium hover:underline">
                      support@soumyafurnishings.com
                    </a>
                    <span className="text-gray-600">|</span>
                    <a href="tel:+911234567890" className="text-[#4A90E2] font-medium hover:underline">
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
