import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get order items grouped by product
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        totalPrice: true
      },
      orderBy: {
        _sum: {
          totalPrice: 'desc'
        }
      },
      take: 10
    })

    // Get product details
    const productIds = orderItems.map(item => item.productId).filter((id): id is string => id !== null)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: {
        id: true,
        title: true
      }
    })

    // Map products to order data
    const topProducts = orderItems
      .filter(item => item.productId !== null)
      .map(item => {
        const product = products.find(p => p.id === item.productId)
        return {
          id: item.productId!,
          name: product?.title || "Unknown Product",
          sales: item._sum.quantity || 0,
          revenue: (item._sum.totalPrice || 0) / 100
        }
      })

    return NextResponse.json(topProducts)
  } catch (error) {
    console.error("Error fetching top products:", error)
    return NextResponse.json(
      { error: "Failed to fetch top products" },
      { status: 500 }
    )
  }
}
