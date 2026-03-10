# Delhivery Production Setup Checklist

This checklist ensures your Delhivery integration is ready for real customer orders.

---

## 📋 Pre-Production Checklist

### ✅ 1. Delhivery Account Setup

- [ ] **Registered with Delhivery**
  - Visit: https://www.delhivery.com/partner/
  - Complete business verification
  - Get approved for shipping services

- [ ] **Warehouse Registered**
  - Add your warehouse/pickup location in Delhivery portal
  - Verify pincode is serviceable
  - Complete address verification

- [ ] **API Credentials Obtained**
  - Login to Delhivery Partner Portal
  - Navigate to API Settings
  - Copy your Production API Key

- [ ] **Payment Terms Agreed**
  - COD remittance schedule
  - Shipping rate card
  - Weight slabs and pricing

---

### ✅ 2. Environment Configuration

Update your `.env.local` (or `.env.production` for Vercel):

```bash
# Delhivery API Configuration
DELHIVERY_API_KEY=your_actual_production_api_key_here
DELHIVERY_API_URL=https://track.delhivery.com/api

# Warehouse Details (MUST match Delhivery portal registration)
WAREHOUSE_PINCODE=132103
WAREHOUSE_NAME=Soumya Furnishings
WAREHOUSE_ADDRESS=Near Pillar No 48, Main Hansi Road
WAREHOUSE_CITY=Panipat
WAREHOUSE_STATE=Haryana
WAREHOUSE_PHONE=+919876543210
WAREHOUSE_EMAIL=warehouse@soumyafurnishings.com
```

**⚠️ CRITICAL:** Warehouse address must EXACTLY match what you registered in Delhivery portal.

---

### ✅ 3. Test Order Flow

#### Step 1: Place Test Order
- [ ] Go to your website
- [ ] Add products to cart
- [ ] Complete checkout with:
  - Valid customer details
  - Real delivery address
  - Choose COD or Online Payment

#### Step 2: Verify Order Created
```bash
# Check database
npx prisma studio
```
- [ ] Order exists in Orders table
- [ ] Order has correct customer details
- [ ] Order has complete shipping address

#### Step 3: Verify Shipment Created
After order placement, check:
- [ ] Order has `delhiveryWaybill` in database
- [ ] Order status changed to "SHIPPED"
- [ ] `trackingNumber` and `trackingUrl` are populated

#### Step 4: Test Tracking
- [ ] Go to `/track` page
- [ ] Enter order number or waybill
- [ ] See real tracking info from Delhivery

---

### ✅ 4. Check Server Logs

When order is placed, you should see:

```
Creating Delhivery shipment from: Panipat 132103
Shipping to: [Customer City] [Customer Pincode]
Calling Delhivery API to create shipment...
Delhivery shipment created successfully. Waybill: DLVXXXXXXXXX
Order updated with tracking details: [order-id]
```

**If you see errors:**
- "Delhivery API key not configured" → Check env vars
- "Incomplete shipping address" → Customer didn't fill complete address
- "Service not available" → Pincode not serviceable
- "401 Unauthorized" → Invalid API key

---

### ✅ 5. Serviceability Check

Test if your pincodes are serviceable:

**API Test:**
```bash
curl -X POST http://localhost:3000/api/shipping/serviceability \
  -H "Content-Type: application/json" \
  -d '{
    "destinationPincode": "110001",
    "weight": 1000,
    "paymentMode": "COD",
    "codAmount": 2000
  }'
```

Expected response:
```json
{
  "success": true,
  "available": true,
  "estimatedDays": 3,
  "shippingCharge": 75
}
```

---

### ✅ 6. Weight & Dimensions Configuration

Current defaults (in `app/api/shipping/create/route.ts`):
- Weight: 1000g (1kg)
- Length: 30cm
- Width: 20cm
- Height: 15cm

**Action Required:**
- [ ] Update defaults based on your typical package size
- [ ] Or implement dynamic calculation based on products
- [ ] Consider adding product weights in database

**Example: Dynamic Weight**
```typescript
// In shipping create route
const totalWeight = order.items.reduce((sum, item) => {
  return sum + (item.product.weight || 500) * item.quantity
}, 0)
```

---

### ✅ 7. COD vs Prepaid Logic

Current logic:
- Order with `financialStatus = 'PAID'` → Prepaid
- Order with `financialStatus != 'PAID'` → COD

Verify:
- [ ] Razorpay payments mark order as PAID
- [ ] COD orders are marked as PENDING
- [ ] COD amount is correctly calculated

---

### ✅ 8. Error Handling

Test failure scenarios:

#### Test 1: Invalid Pincode
- [ ] Enter non-serviceable pincode (e.g., 000000)
- [ ] Order should be created
- [ ] Shipment creation should fail gracefully
- [ ] User should see order confirmation (admin creates shipment manually)

#### Test 2: Incomplete Address
- [ ] Submit order without city or pincode
- [ ] Should show validation error
- [ ] Order should not be created

#### Test 3: API Down
- [ ] Temporarily use wrong API key
- [ ] Place order
- [ ] Order created but no waybill
- [ ] Admin can retry shipment creation

---

### ✅ 9. Delhivery Portal Verification

After placing test orders:

- [ ] Login to Delhivery Partner Portal
- [ ] Go to Shipments section
- [ ] Verify test shipments appear
- [ ] Check shipment status
- [ ] Verify pickup is scheduled

---

### ✅ 10. Production Deployment

#### Before Deploying to Vercel:

- [ ] Update production environment variables:
  ```bash
  # In Vercel Dashboard → Settings → Environment Variables
  DELHIVERY_API_KEY=production_key_here
  WAREHOUSE_PINCODE=132103
  WAREHOUSE_NAME=Soumya Furnishings
  WAREHOUSE_ADDRESS=Near Pillar No 48, Main Hansi Road
  WAREHOUSE_CITY=Panipat
  WAREHOUSE_STATE=Haryana
  WAREHOUSE_PHONE=+919876543210
  WAREHOUSE_EMAIL=warehouse@soumyafurnishings.com
  ```

- [ ] Run database migration on production:
  ```bash
  npx prisma migrate deploy
  ```

- [ ] Test one real order after deployment

---

### ✅ 11. Daily Operations Checklist

**Every Morning:**
- [ ] Check Delhivery portal for pending pickups
- [ ] Ensure pickup person has list of orders
- [ ] Verify all orders from yesterday have waybills

**When Order is Placed:**
1. Order created in database ✓
2. Payment processed (if online) ✓
3. Shipment created with Delhivery ✓
4. Customer receives order confirmation email (TODO: implement)
5. Customer can track order on website ✓

**When Delhivery Picks Up:**
1. Update order status to "SHIPPED" (automatic via webhook - TODO)
2. Customer receives shipping notification (TODO: implement)

---

## 🚨 Troubleshooting

### Issue: "Order not found or not shipped yet"
**Cause:** Shipment creation failed  
**Solution:** 
1. Check server logs for error
2. Manually create shipment via admin panel (TODO: implement)
3. Or use Delhivery portal to create shipment

### Issue: "Service not available for this pincode"
**Cause:** Delhivery doesn't deliver there  
**Solution:**
1. Inform customer
2. Offer alternative courier
3. Or arrange own delivery

### Issue: "401 Unauthorized from Delhivery"
**Cause:** Invalid API key  
**Solution:**
1. Verify API key in `.env.local`
2. Check key in Delhivery portal
3. Ensure using production key (not staging)

### Issue: Wrong pickup address on Delhivery
**Cause:** Warehouse env vars don't match portal registration  
**Solution:**
1. Compare env vars with Delhivery portal
2. Update to match EXACTLY
3. Restart server

---

## 📞 Support Contacts

**Delhivery Support:**
- Email: api@delhivery.com
- Phone: 1800-xxx-xxxx
- Portal: https://www.delhivery.com/partner/

**Your Account Manager:**
- Name: [To be assigned]
- Email: [To be assigned]
- Phone: [To be assigned]

---

## ✅ Post-Launch Monitoring

**Week 1:**
- [ ] Monitor all shipment creations
- [ ] Track delivery success rate
- [ ] Check for failed shipments
- [ ] Gather customer feedback on delivery

**Ongoing:**
- [ ] Weekly review of delivery performance
- [ ] Monthly reconciliation with Delhivery
- [ ] Monitor COD remittance
- [ ] Track RTO (Return to Origin) rate

---

## 🎯 Next Steps (Optional Enhancements)

1. **Add Email Notifications**
   - Order confirmation email
   - Shipping notification with tracking link
   - Delivery confirmation

2. **Add SMS Notifications**
   - Order placed
   - Out for delivery alert
   - Delivered confirmation

3. **Admin Panel for Shipments**
   - View all shipments
   - Retry failed shipments
   - Manual shipment creation
   - Bulk manifest upload

4. **Webhooks from Delhivery**
   - Auto-update order status
   - Real-time tracking updates
   - Delivery confirmations

5. **Product Weight Management**
   - Add weight field to products
   - Calculate actual shipping cost
   - Dynamic pricing based on weight

---

## ✅ Sign-Off

- [ ] All checklist items completed
- [ ] Test orders successful
- [ ] Production deployment verified
- [ ] Team trained on order fulfillment
- [ ] Ready for real customer orders

**Completed by:** ___________________  
**Date:** ___________________  
**Signature:** ___________________

---

**Last Updated:** March 2026  
**Version:** 1.0
