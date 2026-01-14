import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Pagination } from "@/components/pagination"
import { CategoryFilters } from "@/components/category-filters"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Category name mapping for display
const CATEGORY_NAMES: Record<string, string> = {
  "bedding": "Bedding",
  "cushions": "Cushions & Pillows",
  "curtains": "Curtains & Drapes",
  "rugs": "Rugs & Runners",
  "table-linen": "Table Linen",
  "throws": "Throws & Blankets",
  "kitchen": "Kitchen Textiles",
}

// Category descriptions
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "bedding": "Transform your bedroom into a luxurious retreat with our premium bedding collection. From soft bedsheets to cozy comforters.",
  "cushions": "Add comfort and style to any space with our handcrafted cushions and pillows in various textures, colors, and designs.",
  "curtains": "Elegant curtains and drapes to frame your windows beautifully while providing privacy and light control.",
  "rugs": "Ground your space with our curated selection of hand-woven rugs, runners, and mats in traditional and modern designs.",
  "table-linen": "Elevate your dining experience with our premium table linens, napkins, placemats, and table covers.",
  "throws": "Cozy up with our luxurious throws and blankets, perfect for adding warmth and style to any room.",
  "kitchen": "Complete your kitchen with our practical and stylish aprons, pot holders, and kitchen textiles.",
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = CATEGORY_NAMES[slug] || slug
  
  return {
    title: `${categoryName} - Soumya Furnishings`,
    description: CATEGORY_DESCRIPTIONS[slug] || `Browse our collection of ${categoryName.toLowerCase()}`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  
  const categoryName = CATEGORY_NAMES[slug]
  if (!categoryName) {
    notFound()
  }

  // Parse query parameters
  const page = Number(searchParamsResolved.page) || 1
  const limit = 24
  const sort = (searchParamsResolved.sort as string) || "featured"
  const minPrice = searchParamsResolved.minPrice
    ? Number(searchParamsResolved.minPrice)
    : undefined
  const maxPrice = searchParamsResolved.maxPrice
    ? Number(searchParamsResolved.maxPrice)
    : undefined
  const materials = searchParamsResolved.materials
    ? Array.isArray(searchParamsResolved.materials)
      ? searchParamsResolved.materials
      : [searchParamsResolved.materials]
    : []
  const colors = searchParamsResolved.colors
    ? Array.isArray(searchParamsResolved.colors)
      ? searchParamsResolved.colors
      : [searchParamsResolved.colors]
    : []
  const rooms = searchParamsResolved.room
    ? Array.isArray(searchParamsResolved.room)
      ? searchParamsResolved.room
      : [searchParamsResolved.room]
    : []

  // Build where clause
  const where: any = {
    category: categoryName,
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  if (materials.length > 0) {
    where.materials = {
      contains: materials.join("|"),
    }
  }

  if (colors.length > 0) {
    where.colors = {
      contains: colors.join("|"),
    }
  }

  if (rooms.length > 0) {
    where.room = {
      in: rooms,
    }
  }

  // Build order by clause
  let orderBy: any = {}
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" }
      break
    case "price-desc":
      orderBy = { price: "desc" }
      break
    case "newest":
      orderBy = { createdAt: "desc" }
      break
    case "rating":
      orderBy = { rating: "desc" }
      break
    default:
      orderBy = { createdAt: "desc" }
  }

  // Fetch products and count
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
      include: {
        images: {
          take: 1,
        },
      },
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  // Get available filters from all products in this category
  const allCategoryProducts = await prisma.product.findMany({
    where: { category: categoryName },
    select: {
      materials: true,
      colors: true,
      room: true,
      price: true,
    },
  })

  // Extract unique values
  const availableMaterials = Array.from(
    new Set(
      allCategoryProducts
        .flatMap((p) => p.materials?.split("|") || [])
        .filter(Boolean)
    )
  )
  const availableColors = Array.from(
    new Set(
      allCategoryProducts
        .flatMap((p) => p.colors?.split("|") || [])
        .filter(Boolean)
    )
  )
  const availableRooms = Array.from(
    new Set(allCategoryProducts.map((p) => p.room).filter(Boolean))
  )
  const prices = allCategoryProducts.map((p) => p.price)
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }

  // Transform products for display
  const transformedProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    compareAtPrice: product.compareAtPrice || undefined,
    currency: product.currency as "INR",
    images: product.images.map((img) => ({
      src: img.src,
      alt: img.alt || product.title,
    })),
    materials: product.materials?.split("|") || [],
    colors: product.colors?.split("|") || [],
    room: product.room as "Living" | "Bedroom" | "Dining" | "Outdoor" | undefined,
    rating: product.rating || undefined,
    reviewsCount: product.reviewsCount || undefined,
    badges: product.badges?.split("|") || [],
    descriptionHtml: product.descriptionHtml || undefined,
  }))

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] to-white pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {categoryName}
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                {CATEGORY_DESCRIPTIONS[slug]}
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm">
                <span>{totalCount} Products</span>
                <span>•</span>
                <span>Handcrafted Quality</span>
                <span>•</span>
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <CategoryFilters
            availableMaterials={availableMaterials}
            availableColors={availableColors}
            availableRooms={availableRooms}
            priceRange={priceRange}
            categorySlug={slug}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Product Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * limit + 1}-
                {Math.min(page * limit, totalCount)} of {totalCount} products
              </p>
            </div>

            {/* Products Grid */}
            {transformedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {transformedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl={`/categories/${slug}`}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
