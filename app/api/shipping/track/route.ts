import { NextRequest, NextResponse } from 'next/server'
import { trackShipment } from '@/lib/delhivery'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/shipping/track?waybill=XXX or ?orderId=XXX
 * Tracks a shipment using Delhivery API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const waybill = searchParams.get('waybill')
    const orderId = searchParams.get('orderId')

    let trackingWaybill = waybill

    // If orderId is provided, fetch waybill from database
    if (orderId && !waybill) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { id: orderId },
            { name: orderId },
            { orderNumber: parseInt(orderId) || undefined },
          ],
        },
      })

      if (!order || !order.delhiveryWaybill) {
        return NextResponse.json(
          { error: 'Order not found or not shipped yet' },
          { status: 404 }
        )
      }

      trackingWaybill = order.delhiveryWaybill
    }

    if (!trackingWaybill) {
      return NextResponse.json(
        { error: 'Waybill or Order ID is required' },
        { status: 400 }
      )
    }

    // Track shipment using Delhivery API
    const trackingData = await trackShipment(trackingWaybill)

    // If it's a test waybill and tracking failed, return mock data
    if (!trackingData.success && trackingWaybill.startsWith('TEST')) {
      const mockData = {
        success: true,
        waybill: trackingWaybill,
        orderId: orderId || trackingWaybill,
        status: {
          status: 'In Transit',
          statusCode: 'In Transit',
          currentLocation: 'Mumbai Distribution Center',
          lastUpdated: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        timeline: [
          {
            status: 'Order Placed',
            location: 'Soumya Furnishings Warehouse',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('en-IN'),
            description: 'Order confirmed and ready for pickup',
          },
          {
            status: 'Picked Up',
            location: 'Mumbai Warehouse',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString('en-IN'),
            description: 'Package picked up by Delhivery',
          },
          {
            status: 'In Transit',
            location: 'Mumbai Distribution Center',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleString('en-IN'),
            description: 'Package is on the way to destination',
          },
        ],
      }
      
      return NextResponse.json(mockData)
    }

    if (!trackingData.success) {
      return NextResponse.json(
        { error: trackingData.error || 'Failed to track shipment' },
        { status: 500 }
      )
    }

    // Update order status in database if changed
    if (orderId) {
      await prisma.order.updateMany({
        where: {
          OR: [{ id: orderId }, { name: orderId }],
        },
        data: {
          delhiveryStatus: trackingData.status.statusCode,
          status: trackingData.status.statusCode,
          fulfillmentStatus:
            trackingData.status.statusCode === 'Delivered' ? 'FULFILLED' : 'PARTIAL',
        },
      })
    }

    return NextResponse.json({
      success: true,
      waybill: trackingData.waybill,
      orderId: trackingData.orderId,
      status: trackingData.status,
      timeline: trackingData.timeline,
    })
  } catch (error) {
    console.error('Error tracking shipment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
