// Quick script to check database orders
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        orderNumber: true,
        email: true,
        total: true,
        delhiveryWaybill: true,
        trackingNumber: true,
        createdAt: true,
      },
    })

    console.log('\n📦 Recent Orders in Database:\n')
    if (orders.length === 0) {
      console.log('❌ No orders found in database')
    } else {
      orders.forEach(order => {
        console.log(`Order: ${order.name || order.id}`)
        console.log(`  Order Number: ${order.orderNumber}`)
        console.log(`  Email: ${order.email}`)
        console.log(`  Total: ₹${order.total / 100}`)
        console.log(`  Waybill: ${order.delhiveryWaybill || 'Not generated'}`)
        console.log(`  Tracking: ${order.trackingNumber || 'Not available'}`)
        console.log(`  Created: ${order.createdAt}`)
        console.log('')
      })
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
  }
}

checkOrders()
