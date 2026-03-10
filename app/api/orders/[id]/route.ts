import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/orders/[id]
 * Fetches order details by ID or order number
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    // Try to find order by ID, name (#1006), or orderNumber (1006)
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { name: orderId },
          { name: `#${orderId}` },
          { orderNumber: parseInt(orderId) || undefined },
        ],
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variant: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        name: order.name,
        orderNumber: order.orderNumber,
        
        // Customer details
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
        
        // Shipping address
        shippingAddress: {
          line1: order.shippingLine1,
          line2: order.shippingLine2,
          city: order.shippingCity,
          state: order.shippingState,
          postalCode: order.shippingPostalCode,
          country: order.shippingCountry,
        },
        
        // Order totals
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        currency: order.currency,
        
        // Payment info
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        financialStatus: order.financialStatus,
        
        // Order status
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus,
        
        // Tracking info
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        delhiveryWaybill: order.delhiveryWaybill,
        delhiveryStatus: order.delhiveryStatus,
        courierName: order.courierName,
        
        // Items
        items: order.items.map(item => ({
          id: item.id,
          title: item.title,
          variantTitle: item.variantTitle,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          product: item.product ? {
            id: item.product.id,
            title: item.product.title,
            images: item.product.images.map(img => img.src),
          } : null,
        })),
        
        // Dates
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
