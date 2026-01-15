import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Await params in Next.js 15+
    const { id } = await params

    // Fetch order with all details
    const order = await prisma.order.findFirst({
      where: {
        id,
        customerId: customer.id
      },
      include: {
        items: {
          select: {
            id: true,
            title: true,
            variantTitle: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}
