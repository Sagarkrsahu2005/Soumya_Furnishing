"use client"

import { useEffect, useState } from "react"
import { Search, Mail, Phone, ShoppingBag, Calendar, Download, TrendingUp, Users } from "lucide-react"

interface Customer {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  acceptsMarketing: boolean
  createdAt: string
  ordersCount: number
  totalSpent: number
  lastOrderDate: string | null
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "spending" | "orders">("newest")

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/customers")
      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setCustomers(data)
      } else if (data.error) {
        console.error("API Error:", data.error)
        alert(`Error: ${data.error}. Please make sure you're logged in as admin.`)
        setCustomers([])
      } else {
        console.error("Invalid data format:", data)
        setCustomers([])
      }
    } catch (error) {
      console.error("Failed to load customers:", error)
      alert("Failed to load customers. Check console for details.")
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers
    .filter(customer => {
      const searchLower = search.toLowerCase()
      const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase()
      return (
        customer.email.toLowerCase().includes(searchLower) ||
        fullName.includes(searchLower) ||
        customer.phone?.includes(search)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "spending":
          return b.totalSpent - a.totalSpent
        case "orders":
          return b.ordersCount - a.ordersCount
        default:
          return 0
      }
    })

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const totalOrders = customers.reduce((sum, c) => sum + c.ordersCount, 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const customersWithOrders = customers.filter(c => c.ordersCount > 0).length

  const exportToCSV = () => {
    const headers = ["Email", "First Name", "Last Name", "Phone", "Orders", "Total Spent", "Registered", "Last Order"]
    const rows = filteredCustomers.map(c => [
      c.email,
      c.firstName || "",
      c.lastName || "",
      c.phone || "",
      c.ordersCount,
      (c.totalSpent / 100).toFixed(2),
      new Date(c.createdAt).toLocaleDateString(),
      c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : "Never"
    ])

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">Manage your customer database</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{customersWithOrders}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalCustomers > 0 ? ((customersWithOrders / totalCustomers) * 100).toFixed(0) : 0}% conversion
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{(totalRevenue / 100).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{(avgOrderValue / 100).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, name, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="spending">Highest Spending</option>
                <option value="orders">Most Orders</option>
              </select>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {search ? "No customers found" : "No customers yet"}
              </h3>
              <p className="text-gray-600">
                {search ? "Try adjusting your search" : "Customers will appear here after they sign up"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Order
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {customer.firstName || customer.lastName
                            ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                            : "—"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Mail size={14} />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.phone ? (
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Phone size={14} />
                          {customer.phone}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <ShoppingBag size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">{customer.ordersCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        ₹{(customer.totalSpent / 100).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        {new Date(customer.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.lastOrderDate ? (
                        <span className="text-sm text-gray-600">
                          {new Date(customer.lastOrderDate).toLocaleDateString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Never</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {!loading && filteredCustomers.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredCustomers.length} of {customers.length} customers
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
