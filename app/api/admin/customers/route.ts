import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const customers = await (prisma as any).customer?.findMany({
      include: {
        orders: true
      },
      orderBy: { createdAt: 'desc' }
    }) || []

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Customers fetch error:", error)
    return NextResponse.json([])
  }
}
