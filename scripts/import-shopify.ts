/*
  Shopify Admin GraphQL importer.
  Requires env vars:
    SHOPIFY_STORE_DOMAIN (e.g. your-store.myshopify.com)
    SHOPIFY_ADMIN_ACCESS_TOKEN (Admin API access token)
    SHOPIFY_API_VERSION (e.g. 2025-01)

  Steps:
    1. Set env vars in .env.local
    2. Run: pnpm import:shopify
    3. Products, variants, images upserted into Prisma DB.
*/

import 'cross-fetch/polyfill'
import { prisma } from '@/lib/db'

const STORE = process.env.SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01'

if (!STORE || !TOKEN) {
  console.error('Missing Shopify credentials. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN.')
  process.exit(1)
}

const endpoint = `https://${STORE}/admin/api/${API_VERSION}/graphql.json`

async function shopifyGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shopify API error ${res.status}: ${text}`)
  }
  const json = await res.json()
  if (json.errors) {
    throw new Error('Shopify GraphQL errors: ' + JSON.stringify(json.errors))
  }
  return json.data
}

// Query minimal product catalog with pagination
const PRODUCTS_QUERY = `#graphql
query Products($cursor: String) {
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
          edges { node { id title selectedOptions { name value } sku price compareAtPrice inventoryQuantity: inventoryQuantity availableForSale } }
        }
        images(first: 10) { edges { node { src altText } } }
        collections(first:10){edges{node{id handle title description}}
        }
      }
    }
  }
}`

interface ShopifyProductEdge {
  node: {
    id: string
    handle: string
    title: string
    descriptionHtml: string
    tags: string[]
    variants: { edges: { node: { id: string; title: string; selectedOptions: { name: string; value: string }[]; sku: string; price: string; compareAtPrice: string | null; inventoryQuantity: number | null; availableForSale: boolean } }[] }
    images: { edges: { node: { src: string; altText: string | null } }[] }
    collections: { edges: { node: { id: string; handle: string; title: string; description: string | null } }[] }
  }
}

async function importProducts() {
  console.log('Starting Shopify import...')
  let cursor: string | null = null
  let count = 0
  while (true) {
    const data: { products: { pageInfo: { hasNextPage: boolean; endCursor: string }; edges: ShopifyProductEdge[] } } = await shopifyGraphQL<{
      products: { pageInfo: { hasNextPage: boolean; endCursor: string }; edges: ShopifyProductEdge[] }
    }>(
      PRODUCTS_QUERY,
      { cursor }
    )
    for (const edge of data.products.edges) {
      const p = edge.node
      count++
      // Convert tags to badges; store options and arrays in delimited format for SQLite
  const materialsTags = p.tags.filter((t: string) => t.startsWith('material:')).map((t: string) => t.replace('material:', ''))
  const colorsTags = p.tags.filter((t: string) => t.startsWith('color:')).map((t: string) => t.replace('color:', ''))
  const roomTag = p.tags.find((t: string) => t.startsWith('room:'))?.replace('room:', '')
  const categoryTag = p.tags.find((t: string) => t.startsWith('category:'))?.replace('category:', '')
  const badgeTags = p.tags.filter((t: string) => t.startsWith('badge:')).map((t: string) => t.replace('badge:', ''))

      // Determine primary pricing from first variant (can refine later)
      const primaryVariantEdge = p.variants.edges[0]?.node
  const basePrice = primaryVariantEdge ? Math.round(parseFloat(primaryVariantEdge.price)) : 0 // store integer currency units
  const compareAt = primaryVariantEdge?.compareAtPrice ? Math.round(parseFloat(primaryVariantEdge.compareAtPrice)) : null

      // Upsert product
      const product = await prisma.product.upsert({
        where: { slug: p.handle },
        update: {
          title: p.title,
          descriptionHtml: p.descriptionHtml,
          materials: materialsTags.length ? materialsTags.join('|') : null,
          colors: colorsTags.length ? colorsTags.join('|') : null,
          room: roomTag || null,
          category: categoryTag || null,
          badges: badgeTags.length ? badgeTags.join('|') : null,
          price: basePrice,
          compareAtPrice: compareAt,
        },
        create: {
          slug: p.handle,
          title: p.title,
          price: basePrice,
          compareAtPrice: compareAt,
          descriptionHtml: p.descriptionHtml,
          materials: materialsTags.length ? materialsTags.join('|') : null,
          colors: colorsTags.length ? colorsTags.join('|') : null,
          room: roomTag || null,
          category: categoryTag || null,
          badges: badgeTags.length ? badgeTags.join('|') : null,
        },
      })

      // Images: remove old, re-create (simplest approach; optimize later)
      await prisma.image.deleteMany({ where: { productId: product.id } })
      if (p.images.edges.length) {
        await prisma.image.createMany({
          data: p.images.edges.map((img: { node: { src: string; altText: string | null } }) => ({ productId: product.id, src: img.node.src, alt: img.node.altText || undefined })),
        })
      }

      // Variants: remove old, re-create
      await prisma.variant.deleteMany({ where: { productId: product.id } })
      if (p.variants.edges.length) {
        for (const vEdge of p.variants.edges) {
          const v = vEdge.node
          const optionsMap: Record<string, string> = {}
          v.selectedOptions.forEach((o: { name: string; value: string }) => (optionsMap[o.name] = o.value))
          await (prisma as any).variant.create({
            data: {
              productId: product.id,
              name: v.title,
              options: JSON.stringify(optionsMap),
              price: Math.round(parseFloat(v.price)),
              compareAtPrice: v.compareAtPrice ? Math.round(parseFloat(v.compareAtPrice)) : null,
              sku: v.sku || null,
              inventoryQuantity: v.inventoryQuantity ?? 0,
            } as any,
          })
        }
      }

      // Collections: connect products to collections
      if (p.collections?.edges?.length) {
        for (const cEdge of p.collections.edges) {
          const c = cEdge.node
          const collection = await (prisma as any).collection.upsert({
            where: { handle: c.handle },
            update: { title: c.title, description: c.description },
            create: { handle: c.handle, title: c.title, description: c.description },
          })
          // Connect pivot if not exists
          await (prisma as any).productOnCollection.upsert({
            where: { productId_collectionId: { productId: product.id, collectionId: collection.id } },
            update: {},
            create: { productId: product.id, collectionId: collection.id },
          })
        }
      }
    }
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  console.log(`Imported ${count} products.`)
}

importProducts()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
