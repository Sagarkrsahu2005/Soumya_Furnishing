import 'cross-fetch/polyfill'
import { prisma } from '@/lib/db'

const STORE = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01'
const endpoint = `https://${STORE}/admin/api/${API_VERSION}/graphql.json`

async function shopifyGraphQL<T>(query: string): Promise<T> {
  console.log('Fetching from Shopify...')
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query }),
  })
  const json = await res.json()
  if (json.errors) throw new Error('GraphQL errors: ' + JSON.stringify(json.errors))
  return json.data
}

const QUERY = `{
  products(first: 10) {
    edges {
      node {
        id
        handle
        title
        descriptionHtml
        tags
        variants(first: 5) {
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
        images(first: 5) { 
          edges { 
            node { src altText } 
          } 
        }
      }
    }
  }
}`

async function main() {
  console.log('Quick import - first 10 products from Shopify...')
  
  const data: any = await shopifyGraphQL(QUERY)
  console.log(`\nFound ${data.products.edges.length} products\n`)
  
  for (const edge of data.products.edges) {
    const p = edge.node
    console.log(`Importing: ${p.title}`)
    
    // Extract tags
    const materialsTags = p.tags.filter((t: string) => t.startsWith('material:')).map((t: string) => t.replace('material:', ''))
    const colorsTags = p.tags.filter((t: string) => t.startsWith('color:')).map((t: string) => t.replace('color:', ''))
    const roomTag = p.tags.find((t: string) => t.startsWith('room:'))?.replace('room:', '')
    const categoryTag = p.tags.find((t: string) => t.startsWith('category:'))?.replace('category:', '')
    const badgeTags = p.tags.filter((t: string) => t.startsWith('badge:')).map((t: string) => t.replace('badge:', ''))
    
    // Get price from first variant
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
    
    // Delete old images and re-create
    await prisma.image.deleteMany({ where: { productId: product.id } })
    if (p.images.edges.length) {
      await prisma.image.createMany({
        data: p.images.edges.map((img: any) => ({ 
          productId: product.id, 
          src: img.node.src, 
          alt: img.node.altText || product.title 
        })),
      })
    }
    
    // Delete old variants and re-create
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
    
    console.log(`✓ Imported: ${p.title} (${p.variants.edges.length} variants, ${p.images.edges.length} images)`)
  }
  
  console.log(`\n✅ Import complete! Imported ${data.products.edges.length} products`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
