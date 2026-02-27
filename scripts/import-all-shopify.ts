import 'cross-fetch/polyfill'
import { prisma } from '@/lib/db'

const STORE = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01'
const endpoint = `https://${STORE}/admin/api/${API_VERSION}/graphql.json`

async function shopifyGraphQL<T>(query: string, variables = {}): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error('GraphQL: ' + JSON.stringify(json.errors))
  return json.data
}

const QUERY = `query Products($cursor: String) {
  products(first: 50, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    edges {
      node {
        id
        handle
        title
        descriptionHtml
        tags
        variants(first: 50) {
          edges { 
            node { 
              id 
              title 
              selectedOptions { name value } 
              sku 
              price 
              compareAtPrice 
              inventoryQuantity 
            } 
          }
        }
        images(first: 10) { 
          edges { 
            node { src altText } 
          } 
        }
        collections(first: 10) {
          edges {
            node {
              id
              handle
              title
              description
            }
          }
        }
      }
    }
  }
}`

async function main() {
  console.log('🚀 Starting FULL Shopify import...\n')
  
  let cursor: string | null = null
  let totalImported = 0
  let pageNum = 0
  
  while (true) {
    pageNum++
    console.log(`📦 Fetching page ${pageNum}...`)
    
    const data: any = await shopifyGraphQL(QUERY, { cursor })
    const products = data.products.edges
    
    console.log(`   Found ${products.length} products on this page`)
    
    for (const edge of products) {
      const p = edge.node
      totalImported++
      
      // Extract tags
      const materialsTags = p.tags.filter((t: string) => t.startsWith('material:')).map((t: string) => t.replace('material:', ''))
      const colorsTags = p.tags.filter((t: string) => t.startsWith('color:')).map((t: string) => t.replace('color:', ''))
      const roomTag = p.tags.find((t: string) => t.startsWith('room:'))?.replace('room:', '')
      const categoryTag = p.tags.find((t: string) => t.startsWith('category:'))?.replace('category:', '')
      const badgeTags = p.tags.filter((t: string) => t.startsWith('badge:')).map((t: string) => t.replace('badge:', ''))
      
      // Price from first variant
      const firstVariant = p.variants.edges[0]?.node
      const price = firstVariant ? Math.round(parseFloat(firstVariant.price)) : 0
      const compareAt = firstVariant?.compareAtPrice ? Math.round(parseFloat(firstVariant.compareAtPrice)) : null
      
      // Upsert product
      const product = await prisma.product.upsert({
        where: { slug: p.handle },
        update: {
          title: p.title,
          descriptionHtml: p.descriptionHtml || null,
          materials: materialsTags.length ? materialsTags.join('|') : null,
          colors: colorsTags.length ? colorsTags.join('|') : null,
          room: roomTag || null,
          category: categoryTag || null,
          badges: badgeTags.length ? badgeTags.join('|') : null,
          price,
          compareAtPrice: compareAt,
        },
        create: {
          slug: p.handle,
          title: p.title,
          price,
          compareAtPrice: compareAt,
          descriptionHtml: p.descriptionHtml || null,
          materials: materialsTags.length ? materialsTags.join('|') : null,
          colors: colorsTags.length ? colorsTags.join('|') : null,
          room: roomTag || null,
          category: categoryTag || null,
          badges: badgeTags.length ? badgeTags.join('|') : null,
        },
      })
      
      // Images
      await prisma.image.deleteMany({ where: { productId: product.id } })
      if (p.images.edges.length) {
        await prisma.image.createMany({
          data: p.images.edges.map((img: any) => ({ 
            productId: product.id, 
            src: img.node.src, 
            alt: img.node.altText || p.title 
          })),
        })
      }
      
      // Variants
      await prisma.variant.deleteMany({ where: { productId: product.id } })
      if (p.variants.edges.length) {
        for (const vEdge of p.variants.edges) {
          const v = vEdge.node
          const optionsMap: Record<string, string> = {}
          v.selectedOptions.forEach((o: any) => (optionsMap[o.name] = o.value))
          
          await prisma.variant.create({
            data: {
              productId: product.id,
              name: v.title,
              options: JSON.stringify(optionsMap),
              price: Math.round(parseFloat(v.price)),
              compareAtPrice: v.compareAtPrice ? Math.round(parseFloat(v.compareAtPrice)) : null,
              sku: v.sku || null,
              inventoryQuantity: v.inventoryQuantity ?? 0,
            },
          })
        }
      }
      
      // Collections
      if (p.collections?.edges?.length) {
        for (const cEdge of p.collections.edges) {
          const c = cEdge.node
          const collection = await prisma.collection.upsert({
            where: { handle: c.handle },
            update: { title: c.title, description: c.description },
            create: { handle: c.handle, title: c.title, description: c.description },
          })
          
          // Connect product to collection
          await prisma.productOnCollection.upsert({
            where: { 
              productId_collectionId: { 
                productId: product.id, 
                collectionId: collection.id 
              } 
            },
            update: {},
            create: { productId: product.id, collectionId: collection.id },
          })
        }
      }
      
      // Progress indicator
      if (totalImported % 10 === 0) {
        process.stdout.write(`   ✓ Imported ${totalImported} products...\r`)
      }
    }
    
    console.log(`   ✅ Page ${pageNum} complete (${totalImported} total)`)
    
    // Check if there are more pages
    if (!data.products.pageInfo.hasNextPage) {
      console.log('\n🎉 No more pages!')
      break
    }
    
    cursor = data.products.pageInfo.endCursor
  }
  
  const finalCount = await prisma.product.count()
  const collectionCount = await prisma.collection.count()
  
  console.log('\n✅ IMPORT COMPLETE!')
  console.log(`   📦 Total products in database: ${finalCount}`)
  console.log(`   🗂️  Total collections: ${collectionCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
