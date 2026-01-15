import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds, collectionIds, action } = body

    if (!productIds || !collectionIds || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!Array.isArray(productIds) || !Array.isArray(collectionIds)) {
      return NextResponse.json(
        { error: "productIds and collectionIds must be arrays" },
        { status: 400 }
      )
    }

    if (action === "add") {
      // Add products to collections
      const operations = []
      
      for (const productId of productIds) {
        for (const collectionId of collectionIds) {
          // Check if already exists
          const existing = await prisma.productOnCollection.findFirst({
            where: {
              productId,
              collectionId
            }
          })

          if (!existing) {
            operations.push(
              prisma.productOnCollection.create({
                data: {
                  productId,
                  collectionId
                }
              })
            )
          }
        }
      }

      await Promise.all(operations)

      return NextResponse.json({
        success: true,
        message: `Added ${productIds.length} products to ${collectionIds.length} collection(s)`
      })

    } else if (action === "remove") {
      // Remove products from collections
      await prisma.productOnCollection.deleteMany({
        where: {
          productId: { in: productIds },
          collectionId: { in: collectionIds }
        }
      })

      return NextResponse.json({
        success: true,
        message: `Removed ${productIds.length} products from ${collectionIds.length} collection(s)`
      })

    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'add' or 'remove'" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Bulk collection edit error:", error)
    return NextResponse.json(
      { error: "Failed to update collections" },
      { status: 500 }
    )
  }
}
