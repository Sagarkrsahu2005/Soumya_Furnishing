import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, slug, descriptionHtml, price, compareAtPrice, sku, materials, colors, room, badges } = body

    // Create product
    const product = await (prisma as any).product.create({
      data: {
        title,
        slug,
        descriptionHtml: descriptionHtml || null,
        price: price || 0,
        compareAtPrice: compareAtPrice || null,
        sku: sku || null,
        materials: materials ? materials.split(',').map((m: string) => m.trim()).join('|') : null,
        colors: colors ? colors.split(',').map((c: string) => c.trim()).join('|') : null,
        room: room || null,
        badges: badges ? badges.split(',').map((b: string) => b.trim()).join('|') : null,
      }
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Create product error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    )
  }
}
