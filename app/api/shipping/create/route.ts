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

    // Default warehouse/pickup location details from environment variables
    const fromAddress = {
      name: process.env.WAREHOUSE_NAME || 'Soumya Furnishings',
      address: process.env.WAREHOUSE_ADDRESS || 'Warehouse Address, Area',
      city: process.env.WAREHOUSE_CITY || 'Panipat',
      state: process.env.WAREHOUSE_STATE || 'Haryana',
      pincode: process.env.WAREHOUSE_PINCODE || '132103',
      phone: process.env.WAREHOUSE_PHONE || '+919876543210',
      email: process.env.WAREHOUSE_EMAIL || 'warehouse@soumyafurnishings.com',
    }

    console.log('Creating Delhivery shipment from:', fromAddress.city, fromAddress.pincode)

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

    // Validate customer address
    if (!toAddress.name || !toAddress.address || !toAddress.city || !toAddress.pincode) {
      console.error('Incomplete customer address:', toAddress)
      return NextResponse.json(
        { error: 'Incomplete shipping address. Please ensure all address fields are filled.' },
        { status: 400 }
      )
    }

    console.log('Shipping to:', toAddress.city, toAddress.pincode)

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
      codAmount: order.financialStatus === 'PAID' ? 0 : order.total / 100,
      shipmentLength: shipmentDetails?.length || 30,
      shipmentWidth: shipmentDetails?.width || 20,
      shipmentHeight: shipmentDetails?.height || 15,
      weight: shipmentDetails?.weight || 1000,
      from: fromAddress,
      to: toAddress,
      products,
    }

    // Create shipment with Delhivery
    console.log('Calling Delhivery API to create shipment...')
    const result = await createShipment(shipmentRequest)

    if (!result.success) {
      console.error('Delhivery shipment creation failed:', result.error)
      return NextResponse.json(
        { 
          success: false,
          error: result.error || 'Failed to create shipment',
          details: 'The order has been placed but shipment creation failed. Admin will create shipment manually.' 
        },
        { status: 500 }
      )
    }

    console.log('Delhivery shipment created successfully. Waybill:', result.waybill)

    // Update order with tracking information
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        delhiveryWaybill: result.waybill,
        trackingNumber: result.waybill,
        trackingUrl: result.trackingUrl,
        delhiveryStatus: 'Booked',
        courierName: 'Delhivery',
        status: 'PROCESSING',
      },
    })

    console.log('Order updated with tracking details:', updatedOrder.id)

    return NextResponse.json({
      success: true,
      waybill: result.waybill,
      trackingUrl: result.trackingUrl,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      message: 'Shipment created successfully with Delhivery',
    })
  } catch (error: any) {
    console.error('Error creating shipment:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
