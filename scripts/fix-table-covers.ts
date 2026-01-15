import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixTableCovers() {
  try {
    console.log('🔍 Finding table covers in Rugs collection...')

    // Find the Rugs collection
    const rugsCollection = await prisma.collection.findFirst({
      where: {
        OR: [
          { title: { equals: 'Rugs', mode: 'insensitive' } },
          { title: { contains: 'Rugs & Runners', mode: 'insensitive' } },
          { title: { contains: 'Rugs and Runners', mode: 'insensitive' } }
        ]
      }
    })

    if (!rugsCollection) {
      console.log('❌ Rugs collection not found')
      
      // List all collections to help debug
      const allCollections = await prisma.collection.findMany()
      console.log('\n📦 Available collections:')
      allCollections.forEach(col => console.log(`  - ${col.title} (${col.id})`))
      return
    }

    console.log(`📦 Found Rugs Collection: ${rugsCollection.title} (${rugsCollection.id})`)

    // Find all products in Rugs collection
    const rugsProducts = await prisma.productOnCollection.findMany({
      where: {
        collectionId: rugsCollection.id
      },
      include: {
        product: true
      }
    })

    console.log(`\n🔍 Found ${rugsProducts.length} products in ${rugsCollection.title} collection`)

    // Filter for table covers - more comprehensive search
    const tableCovers = rugsProducts.filter(item => {
      const title = item.product.title.toLowerCase()
      return title.includes('table cover') || 
             title.includes('tablecloth') || 
             title.includes('table cloth') ||
             title.includes('table linen') ||
             title.includes('dining table') ||
             (title.includes('table') && (title.includes('cover') || title.includes('cloth')))
    })

    console.log(`\n🔍 Found ${tableCovers.length} table covers in ${rugsCollection.title} collection`)

    if (tableCovers.length === 0) {
      console.log('✅ No table covers found in Rugs collection')
      return
    }

    // Show products that will be moved
    console.log('\n📋 Table covers to be moved:')
    tableCovers.forEach((item, index) => {
      console.log(`${index + 1}. ${item.product.title}`)
    })

    // Find target collections
    const tableCoversCollection = await prisma.collection.findFirst({
      where: { 
        OR: [
          { title: { contains: 'Table covers', mode: 'insensitive' } },
          { title: { contains: 'Table Covers', mode: 'insensitive' } }
        ]
      }
    })

    const kitchenLinenCollection = await prisma.collection.findFirst({
      where: { title: { contains: 'Kitchen Linen', mode: 'insensitive' } }
    })

    console.log(`\n📦 Target Collections:`)
    if (tableCoversCollection) {
      console.log(`  - ${tableCoversCollection.title} (${tableCoversCollection.id})`)
    }
    if (kitchenLinenCollection) {
      console.log(`  - ${kitchenLinenCollection.title} (${kitchenLinenCollection.id})`)
    }

    // Move each table cover
    if (tableCovers.length > 0) {
      let movedCount = 0
      
      for (const item of tableCovers) {
        // Add to Table covers collection if exists
        if (tableCoversCollection) {
          const existingInTableCovers = await prisma.productOnCollection.findFirst({
            where: {
              productId: item.productId,
              collectionId: tableCoversCollection.id
            }
          })

          if (!existingInTableCovers) {
            await prisma.productOnCollection.create({
              data: {
                productId: item.productId,
                collectionId: tableCoversCollection.id
              }
            })
            console.log(`  ✓ Added "${item.product.title}" to ${tableCoversCollection.title}`)
          }
        }

        // Add to Kitchen Linen if exists
        if (kitchenLinenCollection) {
          const existingInKitchen = await prisma.productOnCollection.findFirst({
            where: {
              productId: item.productId,
              collectionId: kitchenLinenCollection.id
            }
          })

          if (!existingInKitchen) {
            await prisma.productOnCollection.create({
              data: {
                productId: item.productId,
                collectionId: kitchenLinenCollection.id
              }
            })
            console.log(`  ✓ Added "${item.product.title}" to ${kitchenLinenCollection.title}`)
          }
        }

        // Remove from Rugs collection
        await prisma.productOnCollection.delete({
          where: {
            productId_collectionId: {
              productId: item.productId,
              collectionId: item.collectionId
            }
          }
        })
        console.log(`  ✓ Removed "${item.product.title}" from ${rugsCollection.title}`)

        movedCount++
      }

      console.log(`\n✅ Successfully moved ${movedCount} table covers from ${rugsCollection.title} to proper collections`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixTableCovers()
