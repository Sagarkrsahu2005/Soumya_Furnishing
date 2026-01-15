import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    
    console.log("Admin customers API - Session:", session)
    console.log("Admin customers API - User role:", (session?.user as any)?.role)
    
    if (!session?.user) {
      console.log("No session found")
      return NextResponse.json({ error: "Not logged in" }, { status: 401 })
    }
    
    const userRole = (session.user as any).role
    if (userRole !== "admin" && userRole !== "super_admin") {
      console.log("Not an admin, role is:", userRole)
      return NextResponse.json({ error: "Not authorized - Admin access required" }, { status: 403 })
    }

    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Calculate total spent for each customer
    const customersWithStats = customers.map(customer => ({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      acceptsMarketing: customer.acceptsMarketing,
      createdAt: customer.createdAt,
      ordersCount: customer._count.orders,
      totalSpent: customer.orders.reduce((sum, order) => sum + order.total, 0),
      lastOrderDate: customer.orders.length > 0 
        ? customer.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null
    }))

    return NextResponse.json(customersWithStats)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}
