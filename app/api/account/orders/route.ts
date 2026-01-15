import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    })

    if (!customer) {
      return NextResponse.json({ orders: [] })
    }

    // Fetch customer's orders
    const orders = await prisma.order.findMany({
      where: {
        customerId: customer.id
      },
      include: {
        items: {
          select: {
            id: true,
            title: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
