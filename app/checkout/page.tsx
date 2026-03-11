"use client"

import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { loadRazorpayScript } from "@/lib/razorpay"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShoppingBag, MapPin, CreditCard, FileText, Check } from "lucide-react"
import { useRouter } from "next/navigation"

type PaymentMethod = "cod" | "razorpay"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("razorpay")
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [discountCode, setDiscountCode] = useState("")

  // Load Razorpay script
  useEffect(() => {
    loadRazorpayScript().then(setRazorpayLoaded)
  }, [])

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "Uttar Pradesh",
    pincode: "",
    phone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = 0 // Calculate based on address
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.pincode) newErrors.pincode = "PIN code is required"
    if (!formData.phone) newErrors.phone = "Phone is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Create order
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variant: item.variantId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
          },
          email: formData.email,
          subtotal,
          shipping,
          tax,
          total,
        }),
      })

      const order = await orderResponse.json()

      if (selectedPayment === "cod") {
        clearCart()
        router.push(`/checkout/success?orderId=${order.id}`)
      } else {
        // Razorpay payment
        if (!razorpayLoaded) {
          alert("Payment system is loading. Please wait...")
          setIsProcessing(false)
          return
        }

        const paymentResponse = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            orderId: order.id,
          }),
        })

        const { razorpayOrderId, keyId } = await paymentResponse.json()

        const options = {
          key: keyId,
          amount: total,
          currency: "INR",
          name: "Soumya Furnishing",
          description: `Order #${order.orderNumber}`,
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.id,
              }),
            })

            if (verifyResponse.ok) {
              clearCart()
              router.push(`/checkout/success?orderId=${order.id}`)
            } else {
              alert("Payment verification failed")
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#3b82f6",
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Checkout</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/cart" className="hover:text-emerald-400 transition-colors">Cart</Link>
            <span>→</span>
            <span className="text-emerald-400">Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold text-white">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white">Shipping Address</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="House No., Street Name"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Apartment, Suite, etc. (Optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apartment, Suite, Building"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    >
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state} className="bg-[#1a1a1a]">{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    />
                    {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedPayment("cod")}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === "cod" 
                      ? "border-emerald-500 bg-emerald-500/10" 
                      : "border-white/10 bg-[#1a1a1a] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === "cod" ? "border-emerald-500" : "border-gray-600"
                    }`}>
                      {selectedPayment === "cod" && (
                        <Check className="w-3 h-3 text-emerald-500" />
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-semibold">Cash on Delivery</p>
                      <p className="text-gray-500 text-sm">Pay when you receive the order</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment("razorpay")}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === "razorpay" 
                      ? "border-emerald-500 bg-emerald-500/10" 
                      : "border-white/10 bg-[#1a1a1a] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === "razorpay" ? "border-emerald-500" : "border-gray-600"
                    }`}>
                      {selectedPayment === "razorpay" && (
                        <Check className="w-3 h-3 text-emerald-500" />
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-semibold">Pay Online</p>
                      <p className="text-gray-500 text-sm">UPI, Cards, Netbanking (Powered by Razorpay)</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Special Instructions (Optional)</h2>
              </div>
              
              <textarea
                placeholder="Any special instructions for delivery?"
                rows={4}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* Products */}
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const variant = item.variantId 
                    ? item.product.variants?.find(v => v.id === item.variantId)
                    : null
                  
                  return (
                    <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.images[0]?.src || "/placeholder.svg"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">{item.product.title}</h3>
                        {variant && (
                          <p className="text-xs text-gray-500">
                            {variant.name}
                          </p>
                        )}
                        <p className="text-sm font-bold text-white mt-1">
                          {formatPrice((item.product.price * item.quantity) / 100)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-white/10 pt-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold text-white">{formatPrice(subtotal / 100)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-semibold text-emerald-400">Free</span>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-white">{formatPrice(subtotal / 100)}</span>
                  </div>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                    <Check className="w-3 h-3" />
                    All taxes included in product prices
                  </p>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {isProcessing ? "Processing..." : `Place Order • ${formatPrice(subtotal / 100)}`}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Secure checkout with 256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Delivered by Delhivery - Fast & Reliable</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>7-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
