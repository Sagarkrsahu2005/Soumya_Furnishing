import { prisma } from "@/lib/db"
import { PRODUCTS } from "@/data/products"

async function main() {
  console.log("Seeding products...")
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
    if (existing) continue
    await prisma.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        descriptionHtml: p.descriptionHtml,
  materials: p.materials && p.materials.length > 0 ? p.materials.join("|") : null,
  colors: p.colors && p.colors.length > 0 ? p.colors.join("|") : null,
        room: p.room,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
  badges: p.badges && p.badges.length > 0 ? p.badges.join("|") : null,
        images: {
          create: p.images.map((img) => ({ src: img.src, alt: img.alt }))
        },
        variants: {
          create: (p.variants || []).map((v) => ({
            name: v.name,
            options: JSON.stringify(v.options),
            price: typeof (v as any).price === 'number' ? (v as any).price : p.price || 0,
            sku: (v as any).sku || null,
            inventoryQuantity: typeof (v as any).inventoryQuantity === 'number' ? (v as any).inventoryQuantity : 0,
          }))
        }
      }
    })
  }
  console.log("Seed complete")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
