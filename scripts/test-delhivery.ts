/**
 * Test script to verify Delhivery API integration
 * Run with: npx tsx scripts/test-delhivery.ts
 */

// IMPORTANT: Load environment variables BEFORE any other imports
import { config } from 'dotenv'
import { resolve } from 'path'
const envPath = resolve(process.cwd(), '.env.local')
config({ path: envPath })

async function testDelhiveryIntegration() {
  // Import after env is loaded
  const { createShipment } = await import('../lib/delhivery.js')
  
  console.log('🧪 Testing Delhivery API Integration...\n')
  
  // Check if API key is configured
  if (!process.env.DELHIVERY_API_KEY) {
    console.error('❌ DELHIVERY_API_KEY not found in environment variables')
    console.error('Please add it to your .env.local file')
    process.exit(1)
  }
  
  console.log('✅ API Key found:', process.env.DELHIVERY_API_KEY.substring(0, 10) + '...')
  console.log('✅ API URL:', process.env.DELHIVERY_API_URL)
  console.log('✅ Warehouse:', process.env.WAREHOUSE_NAME, '-', process.env.WAREHOUSE_CITY)
  console.log('')
  
  // Create a test shipment
  console.log('📦 Creating test shipment with Delhivery...\n')
  
  const testShipment = {
    orderNumber: `TEST-${Date.now()}`,
    referenceId: `test-ref-${Date.now()}`,
    paymentMode: 'COD' as const,
    codAmount: 1500, // ₹1500 COD
    shipmentLength: 30,
    shipmentWidth: 20,
    shipmentHeight: 15,
    weight: 1000, // 1kg
    from: {
      name: process.env.WAREHOUSE_NAME || 'Soumya Furnishings',
      address: process.env.WAREHOUSE_ADDRESS || 'Near Pillar No 48, Main Hansi Road',
      city: process.env.WAREHOUSE_CITY || 'Panipat',
      state: process.env.WAREHOUSE_STATE || 'Haryana',
      pincode: process.env.WAREHOUSE_PINCODE || '132103',
      phone: process.env.WAREHOUSE_PHONE || '+919876543210',
      email: process.env.WAREHOUSE_EMAIL || 'warehouse@soumyafurnishings.com',
    },
    to: {
      name: 'Test Customer',
      address: '123 Test Street, Test Area',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      phone: '+919999999999',
      email: 'test@example.com',
    },
    products: [
      {
        name: 'Test Product - Designer Cushion Cover',
        qty: 2,
        price: 750,
        sku: 'TEST-SKU-001',
      },
    ],
  }
  
  console.log('📍 Shipping FROM:', testShipment.from.city, testShipment.from.pincode)
  console.log('📍 Shipping TO:', testShipment.to.city, testShipment.to.pincode)
  console.log('💰 COD Amount: ₹', testShipment.codAmount)
  console.log('')
  
  try {
    const result = await createShipment(testShipment)
    
    console.log('\n' + '='.repeat(60))
    
    if (result.success) {
      console.log('✅ SUCCESS! Real Delhivery waybill generated!\n')
      console.log('📋 Waybill Number:', result.waybill)
      console.log('🔗 Tracking URL:', result.trackingUrl)
      console.log('📦 Shipment ID:', result.shipmentId)
      if (result.estimatedDelivery) {
        console.log('📅 Estimated Delivery:', result.estimatedDelivery)
      }
      console.log('\n' + '✅ Your Delhivery integration is working correctly!')
      console.log('Real tracking numbers will be generated for customer orders.')
    } else {
      console.log('❌ FAILED! Shipment creation failed.\n')
      console.log('Error:', result.error)
      console.log('\nPossible reasons:')
      console.log('1. Invalid API key - Check if your Delhivery API key is correct')
      console.log('2. Warehouse not registered - Register warehouse in Delhivery portal')
      console.log('3. Pincode not serviceable - Check if pincodes are serviceable')
      console.log('4. Account not activated - Contact Delhivery support')
      console.log('\nNext steps:')
      console.log('- Login to: https://www.delhivery.com/partner/')
      console.log('- Verify your account is active')
      console.log('- Check warehouse registration')
      console.log('- Verify API key in Settings > API')
    }
    
    console.log('='.repeat(60) + '\n')
    
  } catch (error) {
    console.error('\n❌ ERROR:', error)
    console.error('\nSomething went wrong while calling Delhivery API')
    console.error('Check the error details above')
  }
}

// Run the test
testDelhiveryIntegration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
