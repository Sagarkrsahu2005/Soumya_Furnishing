import { NextRequest, NextResponse } from 'next/server'
import { createShipment, CreateShipmentRequest } from '@/lib/delhivery'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/shipping/create
 * Creates a shipment with Delhivery and updates the order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, shipmentDetails } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Fetch order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        customer: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Default warehouse/pickup location details
    const fromAddress = {
      name: 'Soumya Furnishings Warehouse',
      address: shipmentDetails?.fromAddress || 'Warehouse Address, Area',
      city: shipmentDetails?.fromCity || 'Mumbai',
      state: shipmentDetails?.fromState || 'Maharashtra',
      pincode: shipmentDetails?.fromPincode || '400001',
      phone: shipmentDetails?.fromPhone || '+919876543210',
      email: 'warehouse@soumyafurnishings.com',
    }

    // Customer shipping address
    const toAddress = {
      name: `${order.firstName || order.customer?.firstName || ''} ${order.lastName || order.customer?.lastName || ''}`.trim(),
      address: `${order.shippingLine1 || ''} ${order.shippingLine2 || ''}`.trim(),
      city: order.shippingCity || '',
      state: order.shippingState || '',
      pincode: order.shippingPostalCode || '',
      phone: order.phone || order.customer?.phone || '',
      email: order.email || order.customer?.email || '',
    }

    // Prepare product details
    const products = order.items.map((item) => ({
      name: item.title,
      qty: item.quantity,
      price: item.unitPrice / 100, // Convert paise to rupees
      sku: item.sku || '',
    }))

    // Calculate package dimensions (you should adjust these based on actual product dimensions)
    const shipmentRequest: CreateShipmentRequest = {
      orderNumber: order.name || order.id,
      referenceId: order.id,
      paymentMode: order.financialStatus === 'PAID' ? 'Prepaid' : 'COD',
      codAmount: order.financialStatus !== 'PAID' ? order.total / 100 : 0,
      shipmentLength: shipmentDetails?.length || 30, // default 30cm
      shipmentWidth: shipmentDetails?.width || 20, // default 20cm
      shipmentHeight: shipmentDetails?.height || 15, // default 15cm
      weight: shipmentDetails?.weight || 1000, // default 1kg
      from: fromAddress,
      to: toAddress,
      products,
    }

    // Create shipment with Delhivery
    const result = await createShipment(shipmentRequest)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create shipment' },
        { status: 500 }
      )
    }

    // Update order with tracking information
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        delhiveryWaybill: result.waybill,
        trackingNumber: result.waybill,
        trackingUrl: result.trackingUrl,
        delhiveryStatus: 'Booked',
        courierName: 'Delhivery',
        fulfillmentStatus: 'SHIPPED',
        status: 'SHIPPED',
        estimatedDelivery: result.estimatedDelivery
          ? new Date(result.estimatedDelivery)
          : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Default 5 days
      },
    })

    return NextResponse.json({
      success: true,
      waybill: result.waybill,
      trackingUrl: result.trackingUrl,
      orderId: updatedOrder.id,
      message: 'Shipment created successfully',
    })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
