import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPricesSQL() {
  try {
    console.log('Starting bulk price fix with SQL...\n');
    
    // Update products
    const productCount = await prisma.$executeRaw`
      UPDATE "Product"
      SET 
        price = price * 100,
        "compareAtPrice" = CASE 
          WHEN "compareAtPrice" IS NOT NULL 
            AND "compareAtPrice" < 10000 
            AND "compareAtPrice" > 0 
          THEN "compareAtPrice" * 100 
          ELSE "compareAtPrice" 
        END
      WHERE price < 10000 AND price > 0
    `;
    
    console.log(`✅ Updated ${productCount} products\n`);
    
    // Update variants
    const variantCount = await prisma.$executeRaw`
      UPDATE "Variant"
      SET 
        price = price * 100,
        "compareAtPrice" = CASE 
          WHEN "compareAtPrice" IS NOT NULL 
            AND "compareAtPrice" < 10000 
            AND "compareAtPrice" > 0 
          THEN "compareAtPrice" * 100 
          ELSE "compareAtPrice" 
        END
      WHERE price < 10000 AND price > 0
    `;
    
    console.log(`✅ Updated ${variantCount} variants\n`);
    
    // Verify
    const remaining = await prisma.product.count({
      where: { price: { lt: 10000, gt: 0 } }
    });
    
    const remainingVariants = await prisma.variant.count({
      where: { price: { lt: 10000, gt: 0 } }
    });
    
    console.log(`\n📊 Verification:`);
    console.log(`   Products with low prices: ${remaining}`);
    console.log(`   Variants with low prices: ${remainingVariants}`);
    
    if (remaining === 0 && remainingVariants === 0) {
      console.log(`\n✨✨✨ ALL PRICES FIXED! ✨✨✨\n`);
    } else {
      console.log(`\n⚠️  Still have ${remaining + remainingVariants} items to fix\n`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

fixPricesSQL()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
