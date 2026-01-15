"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Package, MapPin, Calendar, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface OrderDetails {
  id: string
  orderNumber: number
  total: number
  subtotal: number
  shippingCost: number
  financialStatus: string
  createdAt: string
  items: {
    id: string
    title: string
    variantTitle: string | null
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2: string | null
    city: string
    province: string
    zip: string
    country: string
    phone: string | null
  } | null
}

export default function OrderDetailsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated" && orderId) {
      fetchOrderDetails()
    }
  }, [status, orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/account/orders/${orderId}`)
      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <Link href="/account" className="text-[#7CB342] hover:text-[#689F38]">
              ← Back to Orders
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#7CB342] mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order #{order.orderNumber || order.id.slice(0, 8)}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.financialStatus === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.financialStatus || "PENDING"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-[#7CB342]">
                  ₹{(order.total / 100).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border border-gray-200 rounded-lg p-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.variantTitle && (
                        <p className="text-sm text-gray-600 mt-1">{item.variantTitle}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-2">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.totalPrice / 100).toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        ₹{(item.unitPrice / 100).toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-700 mt-2">{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && (
                    <p className="text-gray-700">{order.shippingAddress.address2}</p>
                  )}
                  <p className="text-gray-700">
                    {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-700 mt-2">Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal / 100).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>₹{(order.shippingCost / 100).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{(order.total / 100).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
