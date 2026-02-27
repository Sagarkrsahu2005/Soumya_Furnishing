import { NextResponse } from "next/server"
import { getProducts } from "@/lib/product-repo"

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const products = await getProducts()
  return NextResponse.json(products)
}
