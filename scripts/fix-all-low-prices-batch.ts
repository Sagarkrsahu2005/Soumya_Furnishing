import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAllLowPrices() {
  console.log('🔍 Fixing all low-priced products and variants...\n');

  try {
    // Get all products with low prices (but not 0)
    const lowProducts = await prisma.product.findMany({
      where: { 
        price: { 
          lt: 10000,
          gt: 0
        }
      },
      select: { 
        id: true, 
        title: true,
        price: true, 
        compareAtPrice: true 
      }
    });

    console.log(`Found ${lowProducts.length} products to fix\n`);

    // Update products one by one
    let productFixed = 0;
    for (const product of lowProducts) {
      const newPrice = product.price * 100;
      const newComparePrice = product.compareAtPrice && product.compareAtPrice < 10000 && product.compareAtPrice > 0
        ? product.compareAtPrice * 100
        : product.compareAtPrice;

      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: newPrice,
          ...(newComparePrice !== product.compareAtPrice && { compareAtPrice: newComparePrice })
        }
      });

      productFixed++;
      if (productFixed % 50 === 0) {
        console.log(`✅ Fixed ${productFixed}/${lowProducts.length} products...`);
      }
    }

    console.log(`\n✅ Fixed ${productFixed} products total\n`);

    // Get all variants with low prices
    const lowVariants = await prisma.variant.findMany({
      where: { 
        price: { 
          lt: 10000,
          gt: 0
        }
      },
      select: { 
        id: true, 
        price: true, 
        compareAtPrice: true 
      }
    });

    console.log(`Found ${lowVariants.length} variants to fix\n`);

    // Update variants
    let variantFixed = 0;
    for (const variant of lowVariants) {
      const newPrice = variant.price ? variant.price * 100 : null;
      const newComparePrice = variant.compareAtPrice && variant.compareAtPrice < 10000 && variant.compareAtPrice > 0
        ? variant.compareAtPrice * 100
        : variant.compareAtPrice;

      await prisma.variant.update({
        where: { id: variant.id },
        data: {
          ...(newPrice && { price: newPrice }),
          ...(newComparePrice !== variant.compareAtPrice && { compareAtPrice: newComparePrice })
        }
      });

      variantFixed++;
      if (variantFixed % 50 === 0) {
        console.log(`✅ Fixed ${variantFixed}/${lowVariants.length} variants...`);
      }
    }

    console.log(`\n✅ Fixed ${variantFixed} variants total\n`);
    console.log(`\n✨✨✨ COMPLETE ✨✨✨`);
    console.log(`Products: ${productFixed}`);
    console.log(`Variants: ${variantFixed}`);
    console.log(`Total: ${productFixed + variantFixed}`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

fixAllLowPrices()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
