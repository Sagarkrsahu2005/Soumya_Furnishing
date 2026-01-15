import { prisma } from "./prisma"
import { PRODUCTS } from "@/data/products"
import type { Product } from "@/lib/types"

// Map Prisma Product to app Product type
function mapProduct(p: any): Product {
  const variants = p.variants.map((v: any) => ({
    id: v.id,
    name: v.name,
    options: JSON.parse(v.options || "{}"),
    price: typeof v.price === "number" ? v.price : 0,
    compareAtPrice: v.compareAtPrice ?? undefined,
    sku: v.sku ?? undefined,
    inventoryQuantity: typeof v.inventoryQuantity === "number" ? v.inventoryQuantity : 0,
  }))

  // Determine product display price: prefer min variant price if available
  const variantPrices = variants.map((v: { price?: number }) => v.price || 0).filter((n: number) => Number.isFinite(n))
  const displayPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : p.price

  // Map collections
  const collections = p.collections?.map((pc: any) => ({
    id: pc.collection.id,
    title: pc.collection.title,
    handle: pc.collection.handle,
  })) || []

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    sku: p.sku ?? undefined,
    price: displayPrice,
    compareAtPrice: p.compareAtPrice ?? undefined,
    currency: "INR",
    images: p.images.map((img: any) => ({ src: img.src, alt: img.alt || undefined })),
    variants,
    materials: p.materials ? String(p.materials).split("|") : [],
    colors: p.colors ? String(p.colors).split("|") : [],
    room: p.room ?? undefined,
    rating: p.rating ?? undefined,
    reviewsCount: p.reviewsCount ?? undefined,
  badges: p.badges ? String(p.badges).split("|") : [],
    descriptionHtml: p.descriptionHtml ?? undefined,
    care: undefined, // Not yet persisted
    collections,
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL) {
    return PRODUCTS
  }
  try {
    const data = await prisma.product.findMany({ 
      include: { 
        images: true, 
        variants: true,
        collections: {
          include: {
            collection: true
          }
        }
      } 
    })
    if (!data || data.length === 0) return PRODUCTS
    return data.map(mapProduct)
  } catch (e) {
    console.error("DB getProducts fallback to static PRODUCTS", e)
    return PRODUCTS
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!process.env.DATABASE_URL) {
    return PRODUCTS.find((p) => p.slug === slug)
  }
  try {
    const p = await prisma.product.findUnique({ 
      where: { slug }, 
      include: { 
        images: true, 
        variants: true,
        collections: {
          include: {
            collection: true
          }
        }
      } 
    })
    return p ? mapProduct(p) : PRODUCTS.find((pr) => pr.slug === slug)
  } catch (e) {
    console.error("DB getProductBySlug fallback", e)
    return PRODUCTS.find((p) => p.slug === slug)
  }
}
