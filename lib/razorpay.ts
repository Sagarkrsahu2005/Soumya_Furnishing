import Razorpay from "razorpay"

// Initialize Razorpay instance lazily to avoid errors during build
let razorpayInstance: Razorpay | null = null

export const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    console.log("Initializing Razorpay with Key ID:", keyId?.substring(0, 10) + "...")
    
    if (!keyId || !keySecret) {
      console.error("Razorpay credentials missing:", { 
        hasKeyId: !!keyId, 
        hasKeySecret: !!keySecret 
      })
      throw new Error("Razorpay credentials not found in environment variables")
    }
    
    try {
      razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
      console.log("Razorpay instance created successfully")
    } catch (error) {
      console.error("Error creating Razorpay instance:", error)
      throw error
    }
  }
  return razorpayInstance
}

// Load Razorpay script in browser
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export interface RazorpayOrderOptions {
  amount: number // in smallest currency unit (paise for INR)
  currency: string
  receipt: string
  notes?: Record<string, any>
}

export interface RazorpayPaymentOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, any>
  theme?: {
    color?: string
  }
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}
