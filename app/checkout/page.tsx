"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Check, MapPin, CreditCard, ShoppingBag, Package, Truck, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

type PaymentMethod = "cod" | "upi" | "card"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cod")

  // Form State
  const [formData, setFormData] = useState({
    // Contact Info
    email: "",
    phone: "",

    // Shipping Address
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",

    // Payment Details (for UPI/Card)
    upiId: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",

    // Special Instructions
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = subtotal > 2000 ? 0 : 299
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Contact validation
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"

    if (!formData.phone) newErrors.phone = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits"

    // Shipping validation
    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.pincode) newErrors.pincode = "Pincode is required"
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits"

    // Payment validation
    if (selectedPayment === "upi" && !formData.upiId) {
      newErrors.upiId = "UPI ID is required"
    }
    if (selectedPayment === "card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required"
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
        newErrors.cardNumber = "Invalid card number"

      if (!formData.cardName) newErrors.cardName = "Cardholder name is required"
      if (!formData.cardExpiry) newErrors.cardExpiry = "Expiry date is required"
      if (!formData.cardCvv) newErrors.cardCvv = "CVV is required"
      else if (!/^\d{3,4}$/.test(formData.cardCvv)) newErrors.cardCvv = "Invalid CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart and redirect to success page
    clearCart()
    router.push(
      `/checkout/success?orderId=ORD-${Date.now()}&total=${total}&payment=${selectedPayment}`
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-brand-ivory">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-brand-sand mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">Your cart is empty</h1>
            <p className="text-lg text-brand-charcoal/60 mb-8">Add items to your cart before checkout</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold"
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
    <main className="min-h-screen bg-brand-ivory">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-charcoal mb-4">Checkout</h1>
          <div className="flex items-center gap-2 text-sm text-brand-charcoal/60">
            <Link href="/cart" className="hover:text-accent-gold transition-colors">
              Cart
            </Link>
            <span>→</span>
            <span className="text-accent-gold font-medium">Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded border border-brand-sand/30 p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center">
                    <span className="font-bold text-accent-gold">1</span>
                  </div>
                  <h2 className="text-xl font-bold text-brand-charcoal">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${
                        errors.email ? "border-red-500" : "border-brand-sand"
                      } focus:border-accent-gold outline-none transition-colors`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${
                        errors.phone ? "border-red-500" : "border-brand-sand"
                      } focus:border-accent-gold outline-none transition-colors`}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded border border-brand-sand/30 p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-brand-charcoal">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${
                          errors.firstName ? "border-red-500" : "border-brand-sand"
                        } focus:border-accent-gold outline-none transition-colors`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${
                          errors.lastName ? "border-red-500" : "border-brand-sand"
                        } focus:border-accent-gold outline-none transition-colors`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${
                        errors.address ? "border-red-500" : "border-brand-sand"
                      } focus:border-accent-gold outline-none transition-colors`}
                      placeholder="House No., Street Name"
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-brand-sand focus:border-accent-gold outline-none transition-colors"
                      placeholder="Apartment, Suite, Building"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${
                          errors.city ? "border-red-500" : "border-brand-sand"
                        } focus:border-accent-gold outline-none transition-colors`}
                        placeholder="Mumbai"
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${
                          errors.state ? "border-red-500" : "border-brand-sand"
                        } focus:border-accent-gold outline-none transition-colors`}
                        placeholder="Maharashtra"
                      />
                      {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${
                          errors.pincode ? "border-red-500" : "border-brand-sand"
                        } focus:border-accent-gold outline-none transition-colors`}
                        placeholder="400001"
                        maxLength={6}
                      />
                      {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded border border-brand-sand/30 p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-accent-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-brand-charcoal">Payment Method</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${
                      selectedPayment === "cod"
                        ? "border-accent-gold bg-accent-gold/5"
                        : "border-brand-sand hover:border-accent-gold/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={selectedPayment === "cod"}
                      onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                      className="w-5 h-5 text-accent-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-brand-charcoal/70" />
                        <span className="font-semibold text-brand-charcoal">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-brand-charcoal/60 mt-1">Pay when you receive the order</p>
                    </div>
                    {selectedPayment === "cod" && <Check className="w-5 h-5 text-accent-gold" />}
                  </label>

                  {/* UPI */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${
                      selectedPayment === "upi"
                        ? "border-accent-gold bg-accent-gold/5"
                        : "border-brand-sand hover:border-accent-gold/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={selectedPayment === "upi"}
                      onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                      className="w-5 h-5 text-accent-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-brand-charcoal">UPI Payment</span>
                      </div>
                      <p className="text-sm text-brand-charcoal/60 mt-1">Pay using Google Pay, PhonePe, Paytm</p>
                    </div>
                    {selectedPayment === "upi" && <Check className="w-5 h-5 text-accent-gold" />}
                  </label>

                  {/* Credit/Debit Card */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${
                      selectedPayment === "card"
                        ? "border-accent-gold bg-accent-gold/5"
                        : "border-brand-sand hover:border-accent-gold/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                      className="w-5 h-5 text-accent-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-brand-charcoal/70" />
                        <span className="font-semibold text-brand-charcoal">Credit/Debit Card</span>
                      </div>
                      <p className="text-sm text-brand-charcoal/60 mt-1">Visa, Mastercard, Rupay accepted</p>
                    </div>
                    {selectedPayment === "card" && <Check className="w-5 h-5 text-accent-gold" />}
                  </label>
                </div>

                {/* UPI Details */}
                {selectedPayment === "upi" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-brand-sand/30"
                  >
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">
                      UPI ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 ${
                        errors.upiId ? "border-red-500" : "border-brand-sand"
                      } focus:border-accent-gold outline-none transition-colors`}
                      placeholder="yourname@paytm"
                    />
                    {errors.upiId && <p className="mt-1 text-xs text-red-500">{errors.upiId}</p>}
                  </motion.div>
                )}

                {/* Card Details */}
                {selectedPayment === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-brand-sand/30 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${
                          errors.cardNumber ? "border-red-500" : "border-brand-sand"
                        } focus:border-accent-gold outline-none transition-colors`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-2">
                        Cardholder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 ${
                          errors.cardName ? "border-red-500" : "border-brand-sand"
                        } focus:border-accent-gold outline-none transition-colors`}
                        placeholder="JOHN DOE"
                      />
                      {errors.cardName && <p className="mt-1 text-xs text-red-500">{errors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-2">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 ${
                            errors.cardExpiry ? "border-red-500" : "border-brand-sand"
                          } focus:border-accent-gold outline-none transition-colors`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.cardExpiry && <p className="mt-1 text-xs text-red-500">{errors.cardExpiry}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-2">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 ${
                            errors.cardCvv ? "border-red-500" : "border-brand-sand"
                          } focus:border-accent-gold outline-none transition-colors`}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cardCvv && <p className="mt-1 text-xs text-red-500">{errors.cardCvv}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Special Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded border border-brand-sand/30 p-6 md:p-8"
              >
                <h3 className="font-semibold text-brand-charcoal mb-4">Special Instructions (Optional)</h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-brand-sand focus:border-accent-gold outline-none transition-colors resize-none"
                  placeholder="Any special instructions for delivery?"
                />
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 bg-white rounded border border-brand-sand/30 p-6 md:p-8">
                <h2 className="text-xl font-bold text-brand-charcoal mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-brand-sand/30">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-brand-sand/30">
                        <Image
                          src={item.product.images[0]?.src || "/placeholder.svg"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-charcoal truncate">{item.product.title}</p>
                        <p className="text-sm text-brand-charcoal/60">{formatPrice(item.product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6 pb-6 border-b border-brand-sand/30">
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
                  <div className="flex justify-between text-brand-charcoal/70">
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between font-bold text-xl text-brand-charcoal">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-6 py-4 bg-accent-gold text-white font-semibold hover:bg-opacity-90 transition-all border-2 border-accent-gold disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Place Order - ${formatPrice(total)}`
                  )}
                </button>

                {/* Trust Badges */}
                <div className="space-y-3 text-sm text-brand-charcoal/60">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-accent-gold" />
                    <span>Secure checkout with 256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-accent-gold" />
                    <span>Delivered by Delhivery - Fast & Reliable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-accent-gold" />
                    <span>7-day return policy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  )
}
