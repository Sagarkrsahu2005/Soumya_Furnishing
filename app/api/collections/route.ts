import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
  const collections = await (prisma as any).collection.findMany({
      orderBy: { title: "asc" },
      include: {
        products: {
          include: {
            product: {
              include: { images: true, variants: true },
            },
          },
        },
      },
    })

    // Flatten pivot: return collection with products array
  const result = (collections as any[]).map((c: any) => ({
      id: c.id,
      handle: c.handle,
      title: c.title,
      description: c.description || undefined,
  products: (c.products as any[]).map((p: any) => ({
        id: p.product.id,
        slug: p.product.slug,
        title: p.product.title,
  images: (p.product.images as any[]).map((i: any) => ({ src: i.src, alt: i.alt || undefined })),
      })),
    }))

    return NextResponse.json(result)
  } catch (e) {
    console.error("/api/collections error", e)
    return NextResponse.json({ error: "Failed to load collections" }, { status: 500 })
  }
}
