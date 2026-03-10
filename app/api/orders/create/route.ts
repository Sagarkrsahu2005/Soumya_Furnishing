import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/orders/create
 * Creates an order in the database with shipping details
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received order creation request:', JSON.stringify(body, null, 2))
    
    const {
      items,
      customer,
      shipping,
      payment,
      totals,
    } = body

    // Validate required fields
    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      console.error('Missing customer information:', customer)
      return NextResponse.json(
        { success: false, error: 'Missing customer information' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      console.error('No items in order')
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

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
            variantTitle: null, // Will be populated from variant lookup if needed
            sku: item.sku || null,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            productId: item.productId || null,
            variantId: item.variant || null, // variant contains the variantId
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
  } catch (error: any) {
    console.error('Error creating order:', error)
    console.error('Error details:', error.message || error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
