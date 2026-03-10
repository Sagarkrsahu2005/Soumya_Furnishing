import { prisma } from '@/lib/prisma'

async function checkVariants() {
  console.log('\n=== CHECKING VARIANT PRICES ===\n')
  
  const products = await prisma.product.findMany({
    where: {
      variants: {
        some: {}
      }
    },
    include: {
      variants: true
    },
    take: 5
  })
  
  products.forEach(p => {
    console.log(`Product: ${p.title.substring(0, 50)}`)
    console.log(`  Product price: ${p.price} paise = ₹${(p.price / 100)}`)
    console.log(`  Variants:`)
    p.variants.forEach(v => {
      console.log(`    ${v.title}: ${v.price} paise = ₹${(v.price / 100)}`)
    })
    console.log('')
  })
  
  await prisma.$disconnect()
}

checkVariants()
