"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react"

interface Stats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={loading ? "..." : stats.totalProducts.toLocaleString()}
          icon={<Package className="text-blue-600" size={24} />}
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : stats.totalOrders.toLocaleString()}
          icon={<ShoppingCart className="text-green-600" size={24} />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Customers"
          value={loading ? "..." : stats.totalCustomers.toLocaleString()}
          icon={<Users className="text-purple-600" size={24} />}
          bgColor="bg-purple-50"
        />
        <StatCard
          title="Revenue"
          value={loading ? "..." : `₹${(stats.revenue / 100).toLocaleString()}`}
          icon={<DollarSign className="text-orange-600" size={24} />}
          bgColor="bg-orange-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add Product"
            description="Create a new product listing"
            href="/admin/products/new"
          />
          <QuickActionCard
            title="View Orders"
            description="Manage customer orders"
            href="/admin/orders"
          />
          <QuickActionCard
            title="Import Products"
            description="Import from Shopify"
            href="/admin/products/import"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  bgColor 
}: { 
  title: string
  value: string | number
  icon: React.ReactNode
  bgColor: string
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  href
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
    >
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  )
}
