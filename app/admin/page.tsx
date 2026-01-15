"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, ArrowUp, ArrowDown, Activity, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface Stats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  revenue: number
  pendingOrders?: number
  lowStockProducts?: number
  revenueGrowth?: number
  ordersGrowth?: number
}

interface RecentOrder {
  id: string
  customerName: string
  amount: number
  status: string
  date: string
}

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(r => r.json()),
      fetch("/api/admin/recent-orders").then(r => r.json()).catch(() => []),
      fetch("/api/admin/top-products").then(r => r.json()).catch(() => [])
    ]).then(([statsData, ordersData, productsData]) => {
      setStats(statsData || {})
      setRecentOrders(Array.isArray(ordersData) ? ordersData : [])
      setTopProducts(Array.isArray(productsData) ? productsData : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your store overview.</p>
      </div>

      {/* Alert Banner */}
      {(stats.lowStockProducts ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-amber-900">Low Stock Alert</p>
            <p className="text-sm text-amber-700">
              {stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? 's' : ''} running low on inventory.
              <Link href="/admin/products" className="underline ml-2 font-medium">View Products</Link>
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={loading ? "..." : `₹${(stats.revenue / 100).toLocaleString('en-IN')}`}
          icon={<DollarSign className="text-emerald-600" size={24} />}
          bgColor="bg-emerald-50"
          change={stats.revenueGrowth}
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : stats.totalOrders.toLocaleString()}
          icon={<ShoppingCart className="text-blue-600" size={24} />}
          bgColor="bg-blue-50"
          change={stats.ordersGrowth}
          loading={loading}
          subtitle={`${stats.pendingOrders || 0} pending`}
        />
        <StatCard
          title="Products"
          value={loading ? "..." : stats.totalProducts.toLocaleString()}
          icon={<Package className="text-purple-600" size={24} />}
          bgColor="bg-purple-50"
          loading={loading}
        />
        <StatCard
          title="Customers"
          value={loading ? "..." : stats.totalCustomers.toLocaleString()}
          icon={<Users className="text-orange-600" size={24} />}
          bgColor="bg-orange-50"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-[#7CB342] hover:text-[#558B2F] font-medium">
                View All →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <Activity className="animate-spin mx-auto mb-2" size={24} />
                <p>Loading orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart className="mx-auto mb-2 text-gray-300" size={48} />
                <p>No orders yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                <Activity className="animate-spin mx-auto mb-2" size={24} />
                <p className="text-sm">Loading...</p>
              </div>
            ) : topProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Package className="mx-auto mb-2 text-gray-300" size={48} />
                <p className="text-sm">No sales data</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7CB342] to-[#558B2F] flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{product.revenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Add Product"
            description="Create a new product listing"
            href="/admin/products/new"
            icon={<Package size={20} />}
            color="blue"
          />
          <QuickActionCard
            title="View Orders"
            description="Manage customer orders"
            href="/admin/orders"
            icon={<ShoppingCart size={20} />}
            color="green"
          />
          <QuickActionCard
            title="Manage Customers"
            description="View customer database"
            href="/admin/customers"
            icon={<Users size={20} />}
            color="purple"
          />
          <QuickActionCard
            title="Settings"
            description="Configure store settings"
            href="/admin/settings"
            icon={<Activity size={20} />}
            color="orange"
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
  bgColor,
  change,
  loading,
  subtitle
}: { 
  title: string
  value: string | number
  icon: React.ReactNode
  bgColor: string
  change?: number
  loading?: boolean
  subtitle?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${bgColor} p-3 rounded-lg`}>
          {icon}
        </div>
        {change !== undefined && !loading && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  )
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
  color
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
  }

  return (
    <Link
      href={href}
      className="group block p-5 border-2 border-gray-200 rounded-xl hover:border-[#7CB342] hover:shadow-lg transition-all"
    >
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-3 transition-colors`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}
