import { prisma } from '@/lib/prisma'

async function directCheck() {
  const products = await prisma.product.findMany({
    where: {
      title: {
        contains: 'Cotton',
        mode: 'insensitive'
      }
    },
    take: 5,
    select: {
      title: true,
      price: true,
      compareAtPrice: true
    }
  })
  
  console.log('\n=== RAW DATABASE VALUES ===\n')
  products.forEach(p => {
    console.log(p.title.substring(0, 60))
    console.log(`  Database price field: ${p.price}`)
    console.log(`  If treated as rupees: ₹${p.price}`)
    console.log(`  If treated as paise: ₹${(p.price / 100)}`)
    console.log('')
  })
  
  await prisma.$disconnect()
}

directCheck()
