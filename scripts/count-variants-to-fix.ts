import { prisma } from '@/lib/prisma'

async function countVariantsToFix() {
  const allVariants = await prisma.variant.count()
  const lowPriceVariants = await prisma.variant.count({
    where: {
      price: {
        gt: 0,
        lte: 10000
      }
    }
  })
  
  console.log(`\nTotal variants: ${allVariants}`)
  console.log(`Variants needing fix (0 < price ≤ ₹100): ${lowPriceVariants}`)
  console.log(`Already correct (> ₹100): ${allVariants - lowPriceVariants}\n`)
  
  await prisma.$disconnect()
}

countVariantsToFix()
