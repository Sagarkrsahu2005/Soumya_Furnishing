import { NextResponse, NextRequest } from "next/server"
import { getProductBySlug } from "@/lib/product-repo"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const product = await getProductBySlug(slug)
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(product)
}
