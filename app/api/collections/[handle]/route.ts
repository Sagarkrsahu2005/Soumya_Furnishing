import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await ctx.params
    const collection = await (prisma as any).collection.findUnique({
      where: { handle },
      include: {
        products: {
          include: {
            product: { include: { images: true, variants: true } },
          },
        },
      },
    })
    if (!collection) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const result = {
      id: collection.id,
      handle: collection.handle,
      title: collection.title,
      description: collection.description || undefined,
      products: (collection.products as any[]).map((p: any) => ({
        id: p.product.id,
        slug: p.product.slug,
        title: p.product.title,
        images: (p.product.images as any[]).map((i: any) => ({ src: i.src, alt: i.alt || undefined })),
      })),
    }

    return NextResponse.json(result)
  } catch (e) {
    console.error(`/api/collections/[handle] error`, e)
    return NextResponse.json({ error: "Failed to load collection" }, { status: 500 })
  }
}
