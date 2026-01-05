import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Protected endpoint - add authentication in production
export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    // Add a secret key check
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Run categorization
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        category: true,
      },
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

    for (const product of products) {
      if (product.category) continue

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
      categorized,
      total: products.length 
    })
  } catch (error) {
    console.error("Categorization error:", error)
    return NextResponse.json({ error: "Failed to categorize" }, { status: 500 })
  }
}
