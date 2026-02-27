import { NextRequest, NextResponse } from "next/server"
import { getRazorpayInstance } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt, notes } = await request.json()

    // Validate required fields
    if (!amount || !currency || !receipt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get Razorpay instance and create order
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: amount, // amount in smallest currency unit (paise)
      currency: currency,
      receipt: receipt,
      notes: notes || {},
    })

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
