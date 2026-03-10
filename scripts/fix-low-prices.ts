import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLowPrices() {
  console.log('🔍 Finding products with prices under ₹100 (likely incorrect)...\n');

  // Find products with price < 10000 paise (₹100)
  const lowPriceProducts = await prisma.product.findMany({
    where: {
      price: {
        lt: 10000 // Less than ₹100
      }
    },
    select: {
      id: true,
      title: true,
      price: true,
      compareAtPrice: true,
    }
  });

  console.log(`Found ${lowPriceProducts.length} products with low prices\n`);

  let fixed = 0;
  let errors = 0;

  for (const product of lowPriceProducts) {
    try {
      const newPrice = product.price * 100;
      const newComparePrice = product.compareAtPrice ? product.compareAtPrice * 100 : null;

      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: newPrice,
          ...(newComparePrice && { compareAtPrice: newComparePrice })
        }
      });

      console.log(`✅ Fixed: ${product.title}`);
      console.log(`   ${product.price} → ${newPrice} (₹${product.price / 100} → ₹${newPrice / 100})`);
      if (product.compareAtPrice) {
        console.log(`   Compare: ${product.compareAtPrice} → ${newComparePrice} (₹${product.compareAtPrice / 100} → ₹${newComparePrice! / 100})`);
      }
      console.log('');
      fixed++;
    } catch (error) {
      console.error(`❌ Error fixing ${product.title}:`, error);
      errors++;
    }
  }

  // Now fix variants with low prices
  console.log('\n🔍 Finding variants with prices under ₹100...\n');
  
  const lowPriceVariants = await prisma.variant.findMany({
    where: {
      price: {
        lt: 10000
      }
    },
    select: {
      id: true,
      title: true,
      price: true,
      compareAtPrice: true,
      product: {
        select: {
          title: true
        }
      }
    }
  });

  console.log(`Found ${lowPriceVariants.length} variants with low prices\n`);

  let variantsFixed = 0;

  for (const variant of lowPriceVariants) {
    try {
      const newPrice = variant.price ? variant.price * 100 : null;
      const newComparePrice = variant.compareAtPrice ? variant.compareAtPrice * 100 : null;

      await prisma.variant.update({
        where: { id: variant.id },
        data: {
          ...(newPrice && { price: newPrice }),
          ...(newComparePrice && { compareAtPrice: newComparePrice })
        }
      });

      console.log(`✅ Fixed variant: ${variant.product.title} - ${variant.title}`);
      if (variant.price) {
        console.log(`   ${variant.price} → ${newPrice} (₹${variant.price / 100} → ₹${newPrice! / 100})`);
      }
      variantsFixed++;
    } catch (error) {
      console.error(`❌ Error fixing variant:`, error);
      errors++;
    }
  }

  console.log('\n✨ Summary:');
  console.log(`Products fixed: ${fixed}`);
  console.log(`Variants fixed: ${variantsFixed}`);
  console.log(`Errors: ${errors}`);
}

fixLowPrices()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
