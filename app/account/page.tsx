"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { User, Package, MapPin, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  orderNumber: number
  total: number
  financialStatus: string
  createdAt: string
  items: {
    id: string
    title: string
    quantity: number
    unitPrice: number
  }[]
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders()
    }
  }, [status])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/account/orders")
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const customer = session?.user as any

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Welcome back, {customer?.firstName}!</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#7CB342]/10 text-[#7CB342] font-medium"
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/account/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Addresses</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#7CB342] text-white rounded-lg hover:bg-[#689F38] transition-colors"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-6 hover:border-[#7CB342] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Order #{order.orderNumber || order.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ₹{(order.total / 100).toLocaleString("en-IN")}
                            </p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                              order.financialStatus === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {order.financialStatus || "PENDING"}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 mb-4">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {item.quantity}x {item.title}
                              </span>
                              <span className="text-gray-900 font-medium">
                                ₹{((item.unitPrice * item.quantity) / 100).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-gray-500">
                              +{order.items.length - 2} more item(s)
                            </p>
                          )}
                        </div>

                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-2 text-[#7CB342] hover:text-[#689F38] font-medium text-sm"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
