# Delhivery Shipping Integration

This guide will help you set up Delhivery as your delivery partner for Soumya Furnishings.

## Overview

Delhivery integration provides:
- ✅ **Shipment Creation** - Automatically create shipments when orders are placed
- 📦 **Real-time Tracking** - Track packages with AWB/Waybill numbers
- 🗺️ **Serviceability Check** - Verify delivery availability for pincodes
- 💰 **Rate Calculator** - Calculate shipping charges and COD fees
- 📧 **Status Updates** - Get real-time delivery status updates

---

## Setup Instructions

### 1. Get Delhivery API Credentials

1. **Sign up for Delhivery Account**
   - Visit [Delhivery Portal](https://www.delhivery.com/)
   - Contact their sales team or sign up for a business account
   - Complete KYC and onboarding process

2. **Get API Key**
   - Login to Delhivery Partner Portal
   - Navigate to Settings → API Integration
   - Generate API Key (Token)
   - Copy your API Key (starts with a long alphanumeric string)

3. **Set up Pickup Location**
   - Add your warehouse address as a pickup location
   - Note down the pickup location details (address, pincode, phone)

---

### 2. Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# Delhivery API Configuration
DELHIVERY_API_KEY=your_api_key_here
DELHIVERY_API_URL=https://track.delhivery.com/api

# For staging/testing
# DELHIVERY_API_URL=https://staging-express.delhivery.com/api

# Warehouse Configuration
WAREHOUSE_PINCODE=400001
WAREHOUSE_ADDRESS=Your Warehouse Address
WAREHOUSE_CITY=Mumbai
WAREHOUSE_STATE=Maharashtra
WAREHOUSE_PHONE=+919876543210
```

**Important Notes:**
- Use staging URL for testing: `https://staging-express.delhivery.com/api`
- Use production URL for live: `https://track.delhivery.com/api`
- Never commit `.env.local` to version control

---

### 3. Update Database Schema

Run the Prisma migration to add shipping fields to your database:

```bash
# Generate migration
npx prisma migrate dev --name add_delhivery_fields

# Or push changes directly (for development)
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

This adds the following fields to the `Order` model:
- `shippingName`, `shippingAddress`, `shippingCity`, `shippingState`, `shippingPincode`
- `shippingPhone`, `shippingEmail`
- `delhiveryWaybill` (unique tracking number)
- `delhiveryStatus` (shipment status)
- `trackingUrl` (link to track package)
- `estimatedDelivery` (expected delivery date)

---

### 4. Test the Integration

#### Test Serviceability Check

```bash
# Check if a pincode is serviceable
curl http://localhost:3000/api/shipping/serviceability?pincode=400001
```

Expected response:
```json
{
  "success": true,
  "available": true,
  "estimatedDays": 3
}
```

#### Test Tracking (with mock data)

```bash
# Track by order ID or waybill
curl "http://localhost:3000/api/shipping/track?orderId=ORD123"
```

---

## API Endpoints

### 1. Create Shipment
**POST** `/api/shipping/create`

Creates a shipment with Delhivery and returns tracking details.

**Request Body:**
```json
{
  "orderId": "clxxx123456",
  "shipmentDetails": {
    "weight": 1000,
    "length": 30,
    "width": 20,
    "height": 15,
    "fromPincode": "400001",
    "fromAddress": "Warehouse Address",
    "fromCity": "Mumbai",
    "fromState": "Maharashtra",
    "fromPhone": "+919876543210"
  }
}
```

**Response:**
```json
{
  "success": true,
  "waybill": "DLVXXXXXXXX",
  "trackingUrl": "https://www.delhivery.com/track/package/DLVXXXXXXXX",
  "orderId": "clxxx123456",
  "message": "Shipment created successfully"
}
```

---

### 2. Track Shipment
**GET** `/api/shipping/track?waybill=XXX` or `/api/shipping/track?orderId=XXX`

Tracks a shipment and returns real-time status.

**Response:**
```json
{
  "success": true,
  "waybill": "DLVXXXXXXXX",
  "orderId": "ORD123",
  "status": {
    "status": "In Transit",
    "statusCode": "In Transit",
    "currentLocation": "Mumbai Distribution Center",
    "lastUpdated": "2026-01-15T14:30:00",
    "estimatedDelivery": "2026-01-18"
  },
  "timeline": [
    {
      "status": "Booked",
      "location": "Mumbai",
      "timestamp": "15 Jan 2026, 10:30 AM",
      "description": "Shipment booked"
    }
  ]
}
```

---

### 3. Check Serviceability
**POST** `/api/shipping/serviceability`

Checks if delivery is available and calculates shipping charges.

**Request Body:**
```json
{
  "destinationPincode": "411001",
  "weight": 1000,
  "paymentMode": "COD",
  "codAmount": 2500
}
```

**Response:**
```json
{
  "success": true,
  "available": true,
  "estimatedDays": 3,
  "shippingCharge": 75,
  "codCharge": 25
}
```

---

## Usage in Your Application

### 1. Create Shipment After Order Placement

In your checkout success flow, create a shipment:

```typescript
// After order is created
const response = await fetch('/api/shipping/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: newOrder.id,
    shipmentDetails: {
      weight: 1000, // grams
      length: 30,   // cm
      width: 20,    // cm
      height: 15,   // cm
    },
  }),
})

const result = await response.json()
if (result.success) {
  console.log('Shipment created:', result.waybill)
  // Send tracking URL to customer via email/SMS
}
```

### 2. Track Orders

Customers can track their orders on `/track` page by entering:
- Order ID (e.g., `#1001`)
- Waybill number (e.g., `DLVXXXXXXXX`)

### 3. Check Pincode Serviceability

On checkout page, validate pincode:

```typescript
const checkPincode = async (pincode: string) => {
  const response = await fetch(
    `/api/shipping/serviceability?pincode=${pincode}`
  )
  const data = await response.json()
  
  if (!data.available) {
    alert('Sorry, we do not deliver to this pincode yet')
  } else {
    console.log(`Estimated delivery: ${data.estimatedDays} days`)
  }
}
```

---

## Admin Panel Integration

### Create Shipments for Orders

In admin panel, you can manually create shipments:

1. Go to Orders page
2. Select an order
3. Click "Create Shipment"
4. Enter package dimensions
5. Submit to generate waybill

### Track All Shipments

View all active shipments and their status in the admin dashboard.

---

## Going Live

### 1. Switch to Production

Update `.env.local`:
```env
DELHIVERY_API_URL=https://track.delhivery.com/api
DELHIVERY_API_KEY=your_production_api_key
```

### 2. Configure Webhook (Optional)

Set up webhooks to receive automatic status updates:

1. Go to Delhivery Partner Portal → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/shipping/webhook`
3. Select events: `Delivered`, `In Transit`, `Out for Delivery`, `RTO`

### 3. Test Production Environment

- Create test orders
- Verify shipment creation
- Check tracking updates
- Monitor for errors

---

## Supported Features

✅ **Domestic Shipping** - All India coverage  
✅ **COD Support** - Cash on Delivery orders  
✅ **Prepaid Orders** - Online payment orders  
✅ **Real-time Tracking** - Live status updates  
✅ **Automatic Status Sync** - Updates order status  
✅ **Serviceability Check** - Pincode validation  
✅ **Rate Calculator** - Dynamic shipping charges  
✅ **Multiple Pickup Locations** - Support for multiple warehouses  

---

## Troubleshooting

### Issue: "API Key not configured"
- Check if `DELHIVERY_API_KEY` is set in `.env.local`
- Restart your development server

### Issue: "Shipment creation failed"
- Verify all required address fields are provided
- Check if pincode is serviceable
- Ensure API key has proper permissions

### Issue: "Tracking not working"
- Waybill might not be active yet (wait 1-2 hours after creation)
- Check if waybill number is correct
- Verify API credentials

### Issue: "Service not available"
- Pincode might not be serviceable by Delhivery
- Check with Delhivery support for coverage

---

## Production Deployment

When deploying to Vercel/Production:

1. **Add Environment Variables** in Vercel Dashboard:
   ```
   DELHIVERY_API_KEY=xxx
   DELHIVERY_API_URL=https://track.delhivery.com/api
   WAREHOUSE_PINCODE=400001
   WAREHOUSE_ADDRESS=Your Address
   WAREHOUSE_CITY=Mumbai
   WAREHOUSE_STATE=Maharashtra
   WAREHOUSE_PHONE=+919876543210
   ```

2. **Run Database Migration:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Test Production Setup:**
   - Create a test order
   - Verify shipment creation
   - Check tracking functionality

---

## Support & Resources

- **Delhivery Documentation**: https://www.delhivery.com/api/
- **API Support**: api@delhivery.com
- **Customer Support**: 1800-xxx-xxxx
- **Partner Portal**: https://www.delhivery.com/partner/

---

## Cost Structure

Delhivery charges are typically:
- **Surface Shipping**: ₹30-50/500g (varies by zone)
- **Express Shipping**: ₹50-80/500g
- **COD Charges**: 2% of order value (minimum ₹25)
- **RTO Charges**: Applicable if delivery fails

Contact Delhivery sales for custom pricing based on your volume.

---

## Next Steps

1. ✅ Complete Delhivery onboarding
2. ✅ Get API credentials
3. ✅ Configure environment variables
4. ✅ Run database migration
5. ✅ Test in staging environment
6. ✅ Deploy to production
7. ✅ Monitor shipments

For any issues or questions, contact the development team.
