"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  FolderOpen,
  Menu,
  X,
  Bell,
  Search
} from "lucide-react"

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white 
        flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#7CB342] to-[#558B2F] bg-clip-text text-transparent">
              Soumya Admin
            </h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-400">Furniture Management</p>
          {session?.user && (
            <div className="mt-3 p-2 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-300 font-medium truncate">{session.user.email}</p>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink 
            href="/admin" 
            icon={<LayoutDashboard size={20} />} 
            active={pathname === "/admin"}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink 
            href="/admin/products" 
            icon={<Package size={20} />} 
            active={pathname?.startsWith("/admin/products")}
            onClick={() => setSidebarOpen(false)}
          >
            Products
          </NavLink>
          <NavLink 
            href="/admin/orders" 
            icon={<ShoppingCart size={20} />} 
            active={pathname?.startsWith("/admin/orders")}
            onClick={() => setSidebarOpen(false)}
          >
            Orders
          </NavLink>
          <NavLink 
            href="/admin/customers" 
            icon={<Users size={20} />} 
            active={pathname?.startsWith("/admin/customers")}
            onClick={() => setSidebarOpen(false)}
          >
            Customers
          </NavLink>
          <NavLink 
            href="/admin/collections" 
            icon={<FolderOpen size={20} />} 
            active={pathname?.startsWith("/admin/collections")}
            onClick={() => setSidebarOpen(false)}
          >
            Collections
          </NavLink>
          <NavLink 
            href="/admin/settings" 
            icon={<Settings size={20} />} 
            active={pathname?.startsWith("/admin/settings")}
            onClick={() => setSidebarOpen(false)}
          >
            Settings
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-500/10 rounded-lg transition-all group text-gray-300 hover:text-red-400"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 max-w-2xl mx-auto px-4 lg:px-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7CB342] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavLink({ 
  href, 
  icon, 
  children,
  active,
  onClick
}: { 
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg 
        transition-all font-medium group
        ${active 
          ? "bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white shadow-lg shadow-green-500/20" 
          : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
        }
      `}
    >
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  )
}
