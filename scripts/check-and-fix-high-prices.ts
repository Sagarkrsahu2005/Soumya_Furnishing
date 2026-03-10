import { prisma } from '@/lib/prisma'

async function checkAndFix() {
  try {
    console.log('\n🔍 Checking for extremely high prices...\n')
    
    // Find products with prices > ₹10,000 (1,000,000 paise)
    const expensiveProducts = await prisma.product.findMany({
      where: {
        price: {
          gt: 1000000 // More than ₹10,000
        }
      },
      orderBy: {
        price: 'desc'
      },
      take: 20
    })
    
    console.log(`Found ${expensiveProducts.length} products with price > ₹10,000\n`)
    
    if (expensiveProducts.length > 0) {
      console.log('Sample of expensive products:')
      expensiveProducts.slice(0, 5).forEach(p => {
        console.log(`  ${p.title.substring(0, 50)}`)
        console.log(`    Current: ₹${(p.price / 100).toLocaleString('en-IN')}`)
        console.log(`    Should be: ₹${(p.price / 10000).toLocaleString('en-IN')} (divide by 100)`)
        console.log('')
      })
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      readline.question('\n⚠️  Do you want to fix these by dividing by 100? (yes/no): ', async (answer: string) => {
        if (answer.toLowerCase() === 'yes') {
          console.log('\n🔧 Fixing prices...\n')
          
          let fixed = 0
          for (const product of expensiveProducts) {
            const oldPrice = product.price
            const newPrice = Math.round(product.price / 100)
            const newCompareAt = product.compareAtPrice ? Math.round(product.compareAtPrice / 100) : null
            
            await prisma.product.update({
              where: { id: product.id },
              data: {
                price: newPrice,
                compareAtPrice: newCompareAt
              }
            })
            
            console.log(`✅ ${product.title.substring(0, 50)}`)
            console.log(`   ₹${(oldPrice / 100).toLocaleString('en-IN')} → ₹${(newPrice / 100).toLocaleString('en-IN')}`)
            fixed++
          }
          
          console.log(`\n✨ Fixed ${fixed} products!\n`)
        } else {
          console.log('\nCancelled.')
        }
        
        readline.close()
        await prisma.$disconnect()
      })
    } else {
      console.log('✅ No products found with excessive prices.\n')
      await prisma.$disconnect()
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    await prisma.$disconnect()
  }
}

checkAndFix()
