import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Protected endpoint to trigger Shopify import in production
export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    // Verify secret
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if Shopify credentials exist
    if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({ 
        error: "Shopify credentials not configured" 
      }, { status: 500 })
    }

    // Import products from Shopify
    const STORE = process.env.SHOPIFY_STORE_DOMAIN
    const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    const API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01'
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
        throw new Error(`Shopify API error ${res.status}`)
      }
      const json = await res.json()
      if (json.errors) {
        throw new Error('Shopify GraphQL errors: ' + JSON.stringify(json.errors))
      }
      return json.data
    }

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
              edges { node { id title selectedOptions { name value } sku price compareAtPrice inventoryQuantity availableForSale } }
            }
            images(first: 10) { edges { node { src altText } } }
            collections(first:10){edges{node{id handle title description}}}
          }
        }
      }
    }`

    let cursor: string | null = null
    let count = 0

    while (true) {
      const data: any = await shopifyGraphQL(PRODUCTS_QUERY, { cursor })
      
      for (const edge of data.products.edges) {
        const p = edge.node
        count++

        const materialsTags = p.tags.filter((t: string) => t.startsWith('material:')).map((t: string) => t.replace('material:', ''))
        const colorsTags = p.tags.filter((t: string) => t.startsWith('color:')).map((t: string) => t.replace('color:', ''))
        const roomTag = p.tags.find((t: string) => t.startsWith('room:'))?.replace('room:', '')
        const categoryTag = p.tags.find((t: string) => t.startsWith('category:'))?.replace('category:', '')
        const badgeTags = p.tags.filter((t: string) => t.startsWith('badge:')).map((t: string) => t.replace('badge:', ''))

        const primaryVariantEdge = p.variants.edges[0]?.node
        const basePrice = primaryVariantEdge ? Math.round(parseFloat(primaryVariantEdge.price)) : 0
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

        // Images
        await prisma.image.deleteMany({ where: { productId: product.id } })
        if (p.images.edges.length) {
          await prisma.image.createMany({
            data: p.images.edges.map((img: any) => ({ 
              productId: product.id, 
              src: img.node.src, 
              alt: img.node.altText || undefined 
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
      }

      if (!data.products.pageInfo.hasNextPage) break
      cursor = data.products.pageInfo.endCursor
    }

    // Auto-categorize uncategorized products
    const uncategorizedProducts = await prisma.product.findMany({
      where: { category: null },
      select: { id: true, title: true },
    })

    let categorized = 0
    const CATEGORY_KEYWORDS: Record<string, string[]> = {
      'Bedding': ['bed', 'sheet', 'duvet', 'comforter', 'quilt', 'bedspread', 'mattress', 'pillow case'],
      'Cushions & Pillows': ['cushion', 'pillow', 'throw pillow'],
      'Curtains & Drapes': ['curtain', 'drape', 'window', 'sheer', 'valance'],
      'Rugs & Runners': ['rug', 'runner', 'carpet', 'mat', 'doormat'],
      'Table Linen': ['tablecloth', 'table cloth', 'napkin', 'placemat', 'table runner'],
      'Throws & Blankets': ['throw', 'blanket', 'afghan'],
      'Wall Decor': ['wall', 'tapestry', 'hanging'],
    }

    for (const product of uncategorizedProducts) {
      const lowerTitle = product.title.toLowerCase()
      let foundCategory = null

      for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
          if (lowerTitle.includes(keyword)) {
            foundCategory = category
            break
          }
        }
        if (foundCategory) break
      }

      if (foundCategory) {
        await prisma.product.update({
          where: { id: product.id },
          data: { category: foundCategory },
        })
        categorized++
      }
    }

    return NextResponse.json({ 
      success: true, 
      imported: count,
      categorized,
      message: `Successfully imported ${count} products and categorized ${categorized} products`
    })

  } catch (error: any) {
    console.error("Import error:", error)
    return NextResponse.json({ 
      error: "Import failed", 
      details: error.message 
    }, { status: 500 })
  }
}
