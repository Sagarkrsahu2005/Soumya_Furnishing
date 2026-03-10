import { NextRequest, NextResponse } from "next/server"
import { getRazorpayInstance } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt, notes } = await request.json()

    console.log("Creating Razorpay order:", { amount, currency, receipt })

    // Validate required fields
    if (!amount || !currency || !receipt) {
      console.error("Missing required fields:", { amount, currency, receipt })
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get Razorpay instance and create order
    const razorpay = getRazorpayInstance()
    console.log("Razorpay instance obtained successfully")
    
    const order = await razorpay.orders.create({
      amount: amount, // amount in smallest currency unit (paise)
      currency: currency,
      receipt: receipt,
      notes: notes || {},
    })

    console.log("Razorpay order created:", order.id)

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error)
    console.error("Error details:", error.message)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}
