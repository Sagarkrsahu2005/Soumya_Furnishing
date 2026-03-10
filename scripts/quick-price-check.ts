import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function quickCheck() {
  // Get the green curtain from the image
  const green = await prisma.product.findFirst({
    where: {
      title: {
        contains: 'Green',
        mode: 'insensitive'
      },
      title: {
        contains: 'Eyelet',
        mode: 'insensitive'
      }
    }
  });
  
  if (green) {
    console.log('Green Curtain:');
    console.log('Title:', green.title);
    console.log('Price in DB:', green.price, 'paise');
    console.log('Displayed as: ₹' + (green.price / 100).toFixed(2));
    console.log('Expected: ₹625 (₹62,500 shown in screenshot)');
    console.log('');
  }
  
  await prisma.$disconnect();
}

quickCheck();
