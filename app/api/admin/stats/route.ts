import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Get current month dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      orders,
      lastMonthOrders,
      pendingOrders,
      lowStockProducts
    ] = await Promise.all([
      (prisma as any).product.count(),
      (prisma as any).order?.count() || Promise.resolve(0),
      (prisma as any).customer?.count() || Promise.resolve(0),
      (prisma as any).order?.findMany({ 
        where: { createdAt: { gte: startOfMonth } },
        select: { total: true } 
      }) || Promise.resolve([]),
      (prisma as any).order?.findMany({ 
        where: { 
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        select: { total: true } 
      }) || Promise.resolve([]),
      (prisma as any).order?.count({ where: { status: "pending" } }) || Promise.resolve(0),
      (prisma as any).product.count({ where: { inventory: { lt: 10 } } }) || Promise.resolve(0)
    ])

    const revenue = Array.isArray(orders) 
      ? orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
      : 0

    const lastMonthRevenue = Array.isArray(lastMonthOrders)
      ? lastMonthOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
      : 0

    // Calculate growth percentages
    const revenueGrowth = lastMonthRevenue > 0 
      ? Math.round(((revenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0

    const ordersGrowth = lastMonthOrders.length > 0
      ? Math.round(((orders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100)
      : 0

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      revenue,
      pendingOrders,
      lowStockProducts,
      revenueGrowth,
      ordersGrowth
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ 
      totalProducts: 0, 
      totalOrders: 0, 
      totalCustomers: 0, 
      revenue: 0,
      pendingOrders: 0,
      lowStockProducts: 0,
      revenueGrowth: 0,
      ordersGrowth: 0
    })
  }
}
