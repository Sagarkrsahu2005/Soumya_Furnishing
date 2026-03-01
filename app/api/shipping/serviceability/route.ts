import { NextRequest, NextResponse } from 'next/server'
import { checkServiceability } from '@/lib/delhivery'

/**
 * POST /api/shipping/serviceability
 * Checks if delivery is available and calculates shipping charges
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destinationPincode, weight, paymentMode, codAmount } = body

    if (!destinationPincode) {
      return NextResponse.json(
        { error: 'Destination pincode is required' },
        { status: 400 }
      )
    }

    // Default warehouse pincode (should be configured)
    const originPincode = process.env.WAREHOUSE_PINCODE || '400001'

    const result = await checkServiceability({
      originPincode,
      destinationPincode,
      weight: weight || 1000, // Default 1kg
      paymentMode: paymentMode || 'Prepaid',
      codAmount,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Service not available' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      available: result.available,
      estimatedDays: result.estimatedDays,
      shippingCharge: result.shippingCharge,
      codCharge: result.codCharge,
    })
  } catch (error) {
    console.error('Error checking serviceability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/shipping/serviceability?pincode=XXX
 * Quick check if pincode is serviceable
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pincode = searchParams.get('pincode')

    if (!pincode) {
      return NextResponse.json(
        { error: 'Pincode is required' },
        { status: 400 }
      )
    }

    const originPincode = process.env.WAREHOUSE_PINCODE || '400001'

    const result = await checkServiceability({
      originPincode,
      destinationPincode: pincode,
      weight: 1000, // Default 1kg
      paymentMode: 'Prepaid',
    })

    return NextResponse.json({
      success: true,
      available: result.available,
      estimatedDays: result.estimatedDays,
    })
  } catch (error) {
    console.error('Error checking serviceability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
