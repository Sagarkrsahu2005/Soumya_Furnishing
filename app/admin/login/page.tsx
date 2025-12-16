"use client"

import { Suspense } from "react"
import AdminLoginContent from "./login-content"

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginContent />
    </Suspense>
  )
}
