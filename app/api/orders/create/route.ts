import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/orders/create
 * Creates an order in the database with shipping details
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      customer,
      shipping,
      payment,
      totals,
    } = body

    // Generate order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true },
    })
    const orderNumber = (lastOrder?.orderNumber || 0) + 1

    // Create order
    const order = await prisma.order.create({
      data: {
        name: `#${orderNumber}`,
        orderNumber,
        
        // Customer info
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        
        // Shipping address
        shippingLine1: shipping.address,
        shippingLine2: shipping.apartment || null,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingPostalCode: shipping.pincode,
        shippingCountry: 'India',
        
        // Order totals
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        currency: 'INR',
        
        // Payment info
        paymentMethod: payment.method, // 'cod' or 'razorpay'
        paymentStatus: payment.method === 'razorpay' ? 'PAID' : 'PENDING',
        financialStatus: payment.method === 'razorpay' ? 'PAID' : 'PENDING',
        
        // Order status
        status: 'PENDING',
        fulfillmentStatus: 'UNFULFILLED',
        
        // Courier
        courierName: 'Delhivery',
        
        // Notes
        customerNotes: shipping.notes || null,
        
        // Create order items
        items: {
          create: items.map((item: any) => ({
            title: item.title,
            variantTitle: item.variant || null,
            sku: item.sku || null,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            productId: item.productId || null,
            variantId: item.variantId || null,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        name: order.name,
        total: order.total,
      },
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
