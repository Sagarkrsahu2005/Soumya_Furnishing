# Razorpay Payment Gateway Integration

## Overview
Your checkout page now accepts payments via Razorpay, supporting UPI, Cards, Net Banking, and more payment methods. Customers can choose between Cash on Delivery (COD) or Pay Online via Razorpay.

## Setup Instructions

### 1. Get Razorpay API Keys

1. Sign up at [Razorpay](https://razorpay.com/) (it's free for testing)
2. Go to [Dashboard > Settings > API Keys](https://dashboard.razorpay.com/app/keys)
3. Generate API keys (you'll get a Key ID and Key Secret)

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Razorpay credentials to `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Important:** 
   - Use `rzp_test_` prefix for test keys
   - Use `rzp_live_` prefix for production keys
   - Never commit `.env.local` to version control

### 3. Test the Integration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Go to checkout page and select "Pay Online" option
3. Use Razorpay's test card details:
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

## How It Works

### User Flow
1. Customer adds items to cart
2. Goes to checkout and fills shipping details
3. Selects payment method (COD or Pay Online)
4. If Pay Online selected:
   - Razorpay checkout dialog opens
   - Customer enters payment details
   - Payment is processed securely
5. Order confirmation page is shown

### Technical Flow
1. **Frontend**: User clicks "Place Order"
2. **API Call**: `/api/razorpay/create-order` creates a Razorpay order
3. **Razorpay SDK**: Opens secure payment dialog
4. **Payment Processing**: User completes payment on Razorpay
5. **Verification**: `/api/razorpay/verify-payment` verifies payment signature
6. **Success**: User is redirected to success page

## Files Created/Modified

### New Files
- `lib/razorpay.ts` - Razorpay utility functions and TypeScript types
- `app/api/razorpay/create-order/route.ts` - API to create Razorpay orders
- `app/api/razorpay/verify-payment/route.ts` - API to verify payments

### Modified Files
- `app/checkout/page.tsx` - Updated with Razorpay integration
- `.env.example` - Added Razorpay environment variables

## Security Features

✅ **Payment Signature Verification**: Every payment is verified using HMAC SHA256  
✅ **Server-Side Secret**: Your secret key never touches the client  
✅ **HTTPS Required**: Razorpay requires SSL in production  
✅ **PCI Compliant**: Card details never touch your server  

## Going Live

### 1. Switch to Live Mode
1. Get live API keys from Razorpay dashboard
2. Update `.env.local` with live keys (starting with `rzp_live_`)
3. Complete KYC verification on Razorpay
4. Enable payment methods you want to accept

### 2. Webhook Setup (Optional but Recommended)
Set up webhooks to handle payment failures, refunds, etc.:
1. Go to Razorpay Dashboard > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Select events to listen to

## Supported Payment Methods

Through Razorpay, customers can pay using:
- 💳 Credit/Debit Cards (Visa, Mastercard, Rupay, Amex)
- 📱 UPI (Google Pay, PhonePe, Paytm, BHIM)
- 🏦 Net Banking (50+ banks)
- 💰 Wallets (Paytm, Mobikwik, Freecharge)
- 💵 EMI Options
- 🌐 International Cards

## Fees Structure

Razorpay charges:
- **Domestic Cards**: 2% per transaction
- **UPI/Net Banking**: 2% per transaction
- **International Cards**: 3% per transaction

Visit [Razorpay Pricing](https://razorpay.com/pricing/) for latest fees.

## Troubleshooting

### Payment Dialog Not Opening?
- Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- Ensure Razorpay script is loaded (check browser console)
- Verify you're using the correct environment (test vs live)

### Payment Verification Failing?
- Check if `RAZORPAY_KEY_SECRET` is correct
- Ensure signature verification logic matches Razorpay docs
- Check API logs for error messages

### Amount Mismatch?
- Razorpay requires amount in smallest currency unit (paise for INR)
- ₹100 = 10000 paise
- The code automatically multiplies by 100

## Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **API Reference**: https://razorpay.com/docs/api/
- **Support**: https://razorpay.com/support/

## Testing Credentials

Use these test credentials in test mode:

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4111 1111 1111 1112`

**Test UPI:**
- Success: `success@razorpay`
- Failure: `failure@razorpay`

CVV: Any 3 digits  
Expiry: Any future date  
OTP: 1234
