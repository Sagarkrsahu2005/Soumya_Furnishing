import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalCustomers, orders] = await Promise.all([
      (prisma as any).product.count(),
      (prisma as any).order?.count() || Promise.resolve(0),
      (prisma as any).customer?.count() || Promise.resolve(0),
      (prisma as any).order?.findMany({ select: { total: true } }) || Promise.resolve([])
    ])

    const revenue = Array.isArray(orders) 
      ? orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
      : 0

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      revenue
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ 
      totalProducts: 0, 
      totalOrders: 0, 
      totalCustomers: 0, 
      revenue: 0 
    })
  }
}
