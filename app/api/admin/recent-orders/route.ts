import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.customer 
        ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || order.customer.email
        : "Guest",
      amount: order.total / 100,
      status: order.financialStatus || "PENDING",
      date: order.createdAt.toISOString()
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    )
  }
}
