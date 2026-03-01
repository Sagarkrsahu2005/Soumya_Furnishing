/**
 * Delhivery API Integration
 * 
 * This module provides integration with Delhivery's shipping and tracking APIs.
 * 
 * API Documentation: https://www.delhivery.com/api/
 */

// Delhivery API configuration
export const DELHIVERY_CONFIG = {
  apiKey: process.env.DELHIVERY_API_KEY || '',
  apiUrl: process.env.DELHIVERY_API_URL || 'https://track.delhivery.com/api',
  // Use staging URL for testing: https://staging-express.delhivery.com/api
  isProduction: process.env.NODE_ENV === 'production',
}

// Types for Delhivery API
export interface DelhiveryAddress {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email?: string
}

export interface CreateShipmentRequest {
  orderNumber: string
  referenceId: string
  paymentMode: 'COD' | 'Prepaid'
  codAmount?: number
  shipmentLength: number // in cm
  shipmentWidth: number // in cm
  shipmentHeight: number // in cm
  weight: number // in grams
  from: DelhiveryAddress
  to: DelhiveryAddress
  products: {
    name: string
    qty: number
    price: number
    sku?: string
  }[]
}

export interface CreateShipmentResponse {
  success: boolean
  waybill: string
  shipmentId: string
  trackingUrl: string
  estimatedDelivery?: string
  error?: string
}

export interface TrackingStatus {
  status: string
  statusCode: string
  currentLocation: string
  lastUpdated: string
  estimatedDelivery?: string
  deliveredDate?: string
}

export interface TrackingResponse {
  success: boolean
  waybill: string
  orderId: string
  status: TrackingStatus
  timeline: {
    status: string
    location: string
    timestamp: string
    description: string
  }[]
  error?: string
}

export interface ServiceabilityRequest {
  originPincode: string
  destinationPincode: string
  weight: number // in grams
  paymentMode: 'COD' | 'Prepaid'
  codAmount?: number
}

export interface ServiceabilityResponse {
  success: boolean
  available: boolean
  estimatedDays: number
  shippingCharge: number
  codCharge?: number
  error?: string
}

/**
 * Create a shipment with Delhivery
 */
export async function createShipment(
  request: CreateShipmentRequest
): Promise<CreateShipmentResponse> {
  try {
    const { apiKey, apiUrl } = DELHIVERY_CONFIG

    if (!apiKey) {
      throw new Error('Delhivery API key not configured')
    }

    // Prepare shipment data in Delhivery format
    const shipmentData = {
      shipments: [
        {
          name: request.to.name,
          add: request.to.address,
          pin: request.to.pincode,
          city: request.to.city,
          state: request.to.state,
          country: 'India',
          phone: request.to.phone,
          order: request.orderNumber,
          payment_mode: request.paymentMode,
          return_pin: request.from.pincode,
          return_city: request.from.city,
          return_phone: request.from.phone,
          return_add: request.from.address,
          return_state: request.from.state,
          return_country: 'India',
          products_desc: request.products.map(p => p.name).join(', '),
          hsn_code: '',
          cod_amount: request.codAmount || 0,
          order_date: new Date().toISOString(),
          total_amount: request.products.reduce((sum, p) => sum + (p.price * p.qty), 0),
          seller_add: request.from.address,
          seller_name: request.from.name,
          seller_inv: request.referenceId,
          quantity: request.products.reduce((sum, p) => sum + p.qty, 0),
          waybill: '',
          shipment_width: request.shipmentWidth,
          shipment_height: request.shipmentHeight,
          weight: request.weight,
          seller_gst_tin: '',
          shipping_mode: 'Surface',
          address_type: 'home',
        },
      ],
      pickup_location: {
        name: request.from.name,
        add: request.from.address,
        city: request.from.city,
        pin_code: request.from.pincode,
        country: 'India',
        phone: request.from.phone,
      },
    }

    const response = await fetch(`${apiUrl}/cmu/create.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({
        format: 'json',
        data: JSON.stringify(shipmentData),
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return {
        success: false,
        waybill: '',
        shipmentId: '',
        trackingUrl: '',
        error: data.remark || 'Failed to create shipment',
      }
    }

    const waybill = data.packages?.[0]?.waybill || data.waybill
    
    return {
      success: true,
      waybill,
      shipmentId: data.packages?.[0]?.refnum || request.orderNumber,
      trackingUrl: `https://www.delhivery.com/track/package/${waybill}`,
      estimatedDelivery: data.upload_wbn,
    }
  } catch (error) {
    console.error('Delhivery API Error:', error)
    return {
      success: false,
      waybill: '',
      shipmentId: '',
      trackingUrl: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Track a shipment by waybill number
 */
export async function trackShipment(waybill: string): Promise<TrackingResponse> {
  try {
    const { apiKey, apiUrl } = DELHIVERY_CONFIG

    if (!apiKey) {
      throw new Error('Delhivery API key not configured')
    }

    const response = await fetch(
      `${apiUrl}/v1/packages/json/?waybill=${waybill}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${apiKey}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok || !data.ShipmentData || data.ShipmentData.length === 0) {
      return {
        success: false,
        waybill,
        orderId: '',
        status: {
          status: 'Unknown',
          statusCode: '',
          currentLocation: '',
          lastUpdated: '',
        },
        timeline: [],
        error: 'Shipment not found',
      }
    }

    const shipment = data.ShipmentData[0].Shipment
    const scans = data.ShipmentData[0].Shipment.Scans || []

    // Map Delhivery status to our format
    const mapStatus = (status: string): string => {
      const statusMap: Record<string, string> = {
        'Booked': 'Order Placed',
        'Manifested': 'Processing',
        'Pickup Scheduled': 'Processing',
        'Dispatched': 'Shipped',
        'In Transit': 'In Transit',
        'Out For Delivery': 'Out for Delivery',
        'Delivered': 'Delivered',
        'RTO': 'Returned',
        'Pending': 'Pending',
      }
      return statusMap[status] || status
    }

    const currentStatus = shipment.Status.Status
    const timeline = scans.map((scan: any) => ({
      status: mapStatus(scan.ScanDetail.ScanType || scan.ScanDetail.Scan),
      location: scan.ScanDetail.ScannedLocation || '',
      timestamp: new Date(scan.ScanDetail.ScanDateTime).toLocaleString('en-IN'),
      description: scan.ScanDetail.Instructions || scan.ScanDetail.Scan,
    }))

    return {
      success: true,
      waybill,
      orderId: shipment.OrderNo || shipment.ReferenceNo,
      status: {
        status: mapStatus(currentStatus),
        statusCode: currentStatus,
        currentLocation: shipment.Status.StatusLocation || '',
        lastUpdated: shipment.Status.StatusDateTime || '',
        estimatedDelivery: shipment.PromisedDeliveryDate,
        deliveredDate: shipment.Status.StatusType === 'Delivered' ? shipment.Status.StatusDateTime : undefined,
      },
      timeline,
    }
  } catch (error) {
    console.error('Delhivery Tracking Error:', error)
    return {
      success: false,
      waybill,
      orderId: '',
      status: {
        status: 'Error',
        statusCode: '',
        currentLocation: '',
        lastUpdated: '',
      },
      timeline: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check serviceability and get shipping rates
 */
export async function checkServiceability(
  request: ServiceabilityRequest
): Promise<ServiceabilityResponse> {
  try {
    const { apiKey, apiUrl } = DELHIVERY_CONFIG

    if (!apiKey) {
      throw new Error('Delhivery API key not configured')
    }

    const params = new URLSearchParams({
      ss: 'DTO',
      d_pin: request.destinationPincode,
      o_pin: request.originPincode,
      cgm: Math.ceil(request.weight / 1000).toString(), // Convert grams to kg
      pt: request.paymentMode === 'COD' ? 'Pre-paid' : 'COD',
    })

    const response = await fetch(
      `${apiUrl}/kinko/v1/invoice/charges/.json?${params}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${apiKey}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok || !data[0]) {
      return {
        success: false,
        available: false,
        estimatedDays: 0,
        shippingCharge: 0,
        error: 'Service not available for this pincode',
      }
    }

    const serviceData = data[0]
    const shippingCharge = parseFloat(serviceData.total_amount || 0)
    const codCharge = request.paymentMode === 'COD' ? parseFloat(serviceData.cod_charges || 0) : 0

    return {
      success: true,
      available: true,
      estimatedDays: parseInt(serviceData.edd || '5'),
      shippingCharge,
      codCharge,
    }
  } catch (error) {
    console.error('Delhivery Serviceability Error:', error)
    return {
      success: false,
      available: false,
      estimatedDays: 0,
      shippingCharge: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Cancel a shipment
 */
export async function cancelShipment(waybill: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { apiKey, apiUrl } = DELHIVERY_CONFIG

    if (!apiKey) {
      throw new Error('Delhivery API key not configured')
    }

    const response = await fetch(`${apiUrl}/cmu/cancellation/json/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({
        waybill,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.remark || 'Failed to cancel shipment',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Delhivery Cancellation Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
