import { NextResponse } from "next/server"
import { getProducts } from "@/lib/product-repo"

export async function GET() {
  const products = await getProducts()
  return NextResponse.json(products)
}
