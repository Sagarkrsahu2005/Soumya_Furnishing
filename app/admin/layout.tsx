"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  FolderOpen
} from "lucide-react"

export default function AdminLayoutClient({
  children,
  session
}: {
  children: React.ReactNode
  session: any
}) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Soumya Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Content Management</p>
          {session?.user && (
            <p className="text-xs text-gray-500 mt-2">{session.user.email}</p>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/admin" icon={<LayoutDashboard size={20} />} active={pathname === "/admin"}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/products" icon={<Package size={20} />} active={pathname?.startsWith("/admin/products")}>
            Products
          </NavLink>
          <NavLink href="/admin/orders" icon={<ShoppingCart size={20} />} active={pathname?.startsWith("/admin/orders")}>
            Orders
          </NavLink>
          <NavLink href="/admin/customers" icon={<Users size={20} />} active={pathname?.startsWith("/admin/customers")}>
            Customers
          </NavLink>
          <NavLink href="/admin/collections" icon={<FolderOpen size={20} />} active={pathname?.startsWith("/admin/collections")}>
            Collections
          </NavLink>
          <NavLink href="/admin/settings" icon={<Settings size={20} />} active={pathname?.startsWith("/admin/settings")}>
            Settings
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-800 rounded transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function NavLink({ 
  href, 
  icon, 
  children,
  active 
}: { 
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
        active ? "bg-gray-800 text-white" : "hover:bg-gray-800"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
