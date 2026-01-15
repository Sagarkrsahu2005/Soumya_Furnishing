import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 })
    }

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
    const rows = lines.slice(1)

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 0; i < rows.length; i++) {
      try {
        const values = rows[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""))
        const product: any = {}

        headers.forEach((header, index) => {
          product[header] = values[index]
        })

        // Validate required fields
        if (!product.title || !product.slug) {
          errors.push(`Row ${i + 2}: Missing required fields (title, slug)`)
          failed++
          continue
        }

        // Create or update product
        const productData = {
          title: product.title,
          slug: product.slug,
          price: parseFloat(product.price || "0"),
          compareAtPrice: product["compare at price"] ? parseFloat(product["compare at price"]) : null,
          descriptionHtml: product.description || "",
          room: product.room || null,
          category: product.category || null,
        }

        if (product.id && product.id !== "") {
          // Update existing
          await (prisma as any).product.update({
            where: { id: product.id },
            data: productData
          })
          
          // Update inventory on first variant if exists
          const inventory = parseInt(product.inventory || "0")
          if (inventory) {
            const firstVariant = await (prisma as any).variant.findFirst({
              where: { productId: product.id }
            })
            
            if (firstVariant) {
              await (prisma as any).variant.update({
                where: { id: firstVariant.id },
                data: { inventoryQuantity: inventory }
              })
            }
          }
        } else {
          // Create new
          const newProduct = await (prisma as any).product.create({
            data: productData
          })
          
          // Create default variant with inventory
          const inventory = parseInt(product.inventory || "0")
          await (prisma as any).variant.create({
            data: {
              productId: newProduct.id,
              title: "Default",
              price: parseFloat(product.price || "0"),
              inventoryQuantity: inventory
            }
          })
        }

        success++
      } catch (error: any) {
        errors.push(`Row ${i + 2}: ${error.message}`)
        failed++
      }
    }

    return NextResponse.json({
      success,
      failed,
      errors
    })

  } catch (error: any) {
    console.error("Import error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to import products" },
      { status: 500 }
    )
  }
}
