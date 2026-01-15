import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const { 
      title, 
      slug,
      description, 
      descriptionHtml,
      price, 
      compareAtPrice, 
      inventoryQuantity,
      category,
      status,
      room,
      vendor,
      productType,
      tags,
      images
    } = data

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        descriptionHtml: descriptionHtml || description,
        price,
        compareAtPrice,
        room,
        category,
      },
    })

    // Update images if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      await prisma.image.deleteMany({
        where: { productId: id }
      })

      // Create new images
      if (images.length > 0) {
        await prisma.image.createMany({
          data: images.map((img, index) => ({
            productId: id,
            src: img.src,
            position: index + 1
          }))
        })
      }
    }

    // Update first variant's inventory
    if (inventoryQuantity !== undefined) {
      const firstVariant = await prisma.variant.findFirst({
        where: { productId: id },
      })

      if (firstVariant) {
        await prisma.variant.update({
          where: { id: firstVariant.id },
          data: { inventoryQuantity },
        })
      }
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
