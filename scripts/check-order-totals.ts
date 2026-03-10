import { prisma } from '@/lib/prisma'

async function checkOrderTotals() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                price: true,
              }
            }
          }
        }
      }
    })

    console.log('\n📦 Recent Orders:\n')
    
    orders.forEach(order => {
      console.log(`Order ${order.name} (#${order.orderNumber})`)
      console.log(`  Customer: ${order.firstName} ${order.lastName}`)
      console.log(`  Total in DB: ₹${(order.total / 100).toFixed(2)}`)
      console.log(`  Payment: ${order.paymentMethod}`)
      console.log(`  Status: ${order.paymentStatus}`)
      
      console.log(`  Items:`)
      let calculatedSubtotal = 0
      order.items.forEach(item => {
        const itemTotal = item.totalPrice / 100
        calculatedSubtotal += item.totalPrice
        console.log(`    - ${item.title} x${item.quantity} = ₹${itemTotal.toFixed(2)}`)
      })
      
      console.log(`  Subtotal: ₹${(calculatedSubtotal / 100).toFixed(2)}`)
      console.log(`  Shipping: ₹${(order.shipping / 100).toFixed(2)}`)
      console.log(`  Tax: ₹${(order.tax / 100).toFixed(2)}`)
      console.log(`  Total: ₹${(order.total / 100).toFixed(2)}`)
      console.log(`  Created: ${new Date(order.createdAt).toLocaleString('en-IN')}\n`)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkOrderTotals()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
