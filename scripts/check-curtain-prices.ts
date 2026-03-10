import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPrices() {
  const curtains = await prisma.product.findMany({
    where: {
      title: {
        contains: 'Curtain',
        mode: 'insensitive'
      }
    },
    take: 15,
    select: {
      id: true,
      title: true,
      price: true,
      compareAtPrice: true
    }
  });

  console.log('=== CURTAIN PRICES IN DATABASE ===\n');
  curtains.forEach(p => {
    console.log(`${p.title.substring(0, 60)}`);
    console.log(`  Stored Price: ${p.price} paise = ₹${(p.price / 100).toLocaleString('en-IN')}`);
    if (p.compareAtPrice) {
      console.log(`  Stored Compare: ${p.compareAtPrice} paise = ₹${(p.compareAtPrice / 100).toLocaleString('en-IN')}`);
    }
    console.log('');
  });
  
  await prisma.$disconnect();
}

checkPrices().catch(console.error);
