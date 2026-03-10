"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from "lucide-react"

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
  paymentStatus: string
  financialStatus: string
  trackingNumber: string | null
  trackingUrl: string | null
  delhiveryWaybill: string | null
  delhiveryStatus: string | null
  courierName: string | null
  status: string
  fulfillmentStatus: string
  items: Array<{
    id: string
    title: string
    quantity: number
    unitPrice: number
    totalPrice: number
    sku: string | null
    product: {
      id: string
      title: string
      images: Array<{ src: string }>
    } | null
  }>
  createdAt: string
  updatedAt: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingShipment, setCreatingShipment] = useState(false)
  const [shipmentError, setShipmentError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/orders/${params.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setOrder(data.order)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  const createShipment = async () => {
    if (!order) return
    
    setCreatingShipment(true)
    setShipmentError(null)
    
    try {
      const response = await fetch('/api/shipping/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          shipmentDetails: {
            weight: 1000,
            length: 30,
            width: 20,
            height: 15,
          },
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh order data
        const refreshResponse = await fetch(`/api/orders/${params.id}`)
        const refreshData = await refreshResponse.json()
        if (refreshData.success) {
          setOrder(refreshData.order)
        }
        alert(`✅ Shipment created successfully!\nWaybill: ${data.waybill}`)
      } else {
        setShipmentError(data.error || 'Failed to create shipment')
      }
    } catch (error: any) {
      setShipmentError(error.message || 'Failed to create shipment')
    } finally {
      setCreatingShipment(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 shadow-md">
          <p className="font-semibold">⚠️ Order not found</p>
          <p className="text-sm mt-2">The order you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{order.name}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/20"
              >
                <Truck size={20} />
                Track Shipment
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Status */}
          {order.delhiveryWaybill ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="text-emerald-600" size={24} />
                Shipping Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Courier</p>
                    <p className="font-semibold text-gray-900">{order.courierName || 'Delhivery'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <StatusBadge status={order.delhiveryStatus || 'Booked'} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                  <p className="font-mono text-lg font-bold text-emerald-600">{order.delhiveryWaybill}</p>
                </div>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                  >
                    View on Delhivery <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-md p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">No Shipment Created</h3>
                  <p className="text-sm text-amber-800">
                    This order doesn't have a shipping label yet. Create one to generate tracking information.
                  </p>
                </div>
              </div>
              {shipmentError && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4 text-sm text-red-800">
                  {shipmentError}
                </div>
              )}
              <button
                onClick={createShipment}
                disabled={creatingShipment}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingShipment ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Creating Shipment...
                  </>
                ) : (
                  <>
                    <Package size={18} />
                    Create Delhivery Shipment
                  </>
                )}
              </button>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="text-emerald-600" size={24} />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  {item.product?.images[0] && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product.images[0].src}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    {item.sku && (
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{(item.totalPrice / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{(item.unitPrice / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{(order.subtotal / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₹{(order.shipping / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            
            {/* Tax Note */}
            <div className="mt-4 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-xs text-emerald-700 text-center font-medium">✓ All taxes included in product prices</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{(order.total / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="text-emerald-600" size={24} />
              Customer
            </h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {order.firstName} {order.lastName}
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} className="text-gray-400" />
                <a href={`mailto:${order.email}`} className="hover:text-emerald-600 transition-colors text-sm">
                  {order.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} className="text-gray-400" />
                <a href={`tel:${order.phone}`} className="hover:text-emerald-600 transition-colors text-sm">
                  {order.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="text-emerald-600" size={24} />
              Shipping Address
            </h2>
            <div className="text-gray-700 space-y-1">
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="text-emerald-600" size={24} />
              Payment
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-900 capitalize">{order.paymentMethod || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status={order.financialStatus || order.paymentStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getColor = () => {
    switch (status?.toUpperCase()) {
      case 'PAID':
      case 'FULFILLED':
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
      case 'PROCESSING':
      case 'BOOKED':
      case 'IN TRANSIT':
        return 'bg-yellow-100 text-yellow-800'
      case 'REFUNDED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}>
      {status || 'N/A'}
    </span>
  )
}
