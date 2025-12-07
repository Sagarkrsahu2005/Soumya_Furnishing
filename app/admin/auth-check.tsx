import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const isLoginPage = true // Will be determined by route

  // Redirect to login if not authenticated and not already on login page
  if (!session && !isLoginPage) {
    redirect("/admin/login")
  }

  // Redirect to dashboard if authenticated and on login page
  if (session && isLoginPage) {
    redirect("/admin")
  }

  return children
}
