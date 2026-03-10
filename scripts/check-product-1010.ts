import { prisma } from '@/lib/prisma'

async function checkProduct() {
  const product = await prisma.product.findUnique({
    where: { id: 1010 },
    include: {
      variants: true
    }
  })
  
  if (product) {
    console.log('\n=== PRODUCT ID 1010 ===\n')
    console.log('Title:', product.title)
    console.log('Slug:', product.slug)
    console.log('\nPRICE IN DATABASE:')
    console.log('  Raw value:', product.price, 'paise')
    console.log('  Displayed as:', '₹' + (product.price / 100))
    
    if (product.compareAtPrice) {
      console.log('\nCOMPARE AT PRICE:')
      console.log('  Raw value:', product.compareAtPrice, 'paise')
      console.log('  Displayed as:', '₹' + (product.compareAtPrice / 100))
    }
    
    console.log('\nVARIANTS:')
    product.variants.forEach(v => {
      console.log(`  ${v.title}:`)
      console.log(`    Price: ${v.price} paise = ₹${(v.price / 100)}`)
    })
  } else {
    console.log('Product not found!')
  }
  
  await prisma.$disconnect()
}

checkProduct()
