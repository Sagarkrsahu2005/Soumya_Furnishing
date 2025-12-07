import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import AdminLayoutClient from "./layout-client"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  // Public routes that don't require authentication
  const publicRoutes = ['/admin/login']
  
  // If not authenticated and not on login page, redirect to login
  if (!session && !publicRoutes.some(route => true)) {
    redirect('/admin/login')
  }

  // If authenticated, render the admin layout
  if (session) {
    return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>
  }

  // For login page, render without layout
  return children
}
