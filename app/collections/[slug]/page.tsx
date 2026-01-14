import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { ProductCard } from '@/components/product-card'
import { CategoryFilters } from '@/components/category-filters'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const prisma = new PrismaClient()

const ROOM_CONFIG: Record<string, { title: string; description: string; handle: string }> = {
  'bedroom': {
    title: 'Bedroom Collection',
    description: 'Create your dream bedroom sanctuary with our curated collection of bedding, pillows, and decor.',
    handle: 'bedroom'
  },
  'living-room': {
    title: 'Living Room Collection',
    description: 'Transform your living space with stylish cushions, curtains, rugs and elegant accents.',
    handle: 'living-room'
  },
  'dining': {
    title: 'Dining Collection',
    description: 'Elevate every meal with premium table linens, runners, and dining essentials.',
    handle: 'dining'
  },
  'kitchen': {
    title: 'Kitchen Collection',
    description: 'Functional and beautiful kitchen textiles including aprons, towels, and accessories.',
    handle: 'kitchen'
  }
}

// Map URL slugs to database room values
const SLUG_TO_ROOM: Record<string, string> = {
  'bedroom': 'Bedroom',
  'living-room': 'Living Room',
  'dining': 'Dining',
  'kitchen': 'Kitchen'
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const config = ROOM_CONFIG[slug]
  
  if (!config) {
    return { title: 'Collection Not Found' }
  }

  return {
    title: `${config.title} | Soumya Furnishings`,
    description: config.description,
  }
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  
  const config = ROOM_CONFIG[slug]
  
  if (!config) {
    notFound()
  }

  const dbRoom = SLUG_TO_ROOM[slug]
  
  // Pagination
  const page = Number(resolvedSearchParams.page) || 1
  const pageSize = 24
  const skip = (page - 1) * pageSize

  // Filters
  const sortBy = (resolvedSearchParams.sort as string) || 'newest'
  const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined
  const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined
  const materials = resolvedSearchParams.materials 
    ? (typeof resolvedSearchParams.materials === 'string' 
        ? resolvedSearchParams.materials.split(',') 
        : resolvedSearchParams.materials)
    : undefined
  const colors = resolvedSearchParams.colors
    ? (typeof resolvedSearchParams.colors === 'string'
        ? resolvedSearchParams.colors.split(',')
        : resolvedSearchParams.colors)
    : undefined
  const categories = resolvedSearchParams.categories
    ? (typeof resolvedSearchParams.categories === 'string'
        ? resolvedSearchParams.categories.split(',')
        : resolvedSearchParams.categories)
    : undefined

  // Build where clause
  const where: any = {
    room: dbRoom,
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  if (materials && materials.length > 0) {
    where.OR = materials.map(material => ({
      materials: {
        contains: material
      }
    }))
  }

  if (colors && colors.length > 0) {
    if (where.OR) {
      where.AND = [
        { OR: where.OR },
        {
          OR: colors.map(color => ({
            colors: {
              contains: color
            }
          }))
        }
      ]
      delete where.OR
    } else {
      where.OR = colors.map(color => ({
        colors: {
          contains: color
        }
      }))
    }
  }

  if (categories && categories.length > 0) {
    where.category = {
      in: categories
    }
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' }
  
  switch (sortBy) {
    case 'price-asc':
      orderBy = { price: 'asc' }
      break
    case 'price-desc':
      orderBy = { price: 'desc' }
      break
    case 'name-asc':
      orderBy = { title: 'asc' }
      break
    case 'name-desc':
      orderBy = { title: 'desc' }
      break
  }

  // Fetch products
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        images: {
          take: 1,
        },
      },
    }),
    prisma.product.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  // Extract filter data
  const allRoomProducts = await Promise.all([
    prisma.product.findMany({
      where: { room: dbRoom },
      select: {
        materials: true,
        colors: true,
        price: true,
        category: true,
      }
    })
  ]).then(([products]) => products)

  const availableMaterials = [...new Set(allRoomProducts.flatMap(p => p.materials?.split("|") || []).filter(Boolean))].sort()
  const availableColors = [...new Set(allRoomProducts.flatMap(p => p.colors?.split("|") || []).filter(Boolean))].sort()
  const availableCategories = [...new Set(allRoomProducts.map(p => p.category).filter((c): c is string => c !== null))].sort()
  const prices = allRoomProducts.map(p => p.price)
  const priceRange = {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  }

  // Transform products for ProductCard component
  const transformedProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    compareAtPrice: product.compareAtPrice || undefined,
    currency: "INR" as const,
    images: product.images?.map(img => ({
      src: img.src,
      alt: img.alt || product.title
    })) || [],
    materials: product.materials?.split("|") || [],
    colors: product.colors?.split("|") || [],
    room: product.room as "Living" | "Bedroom" | "Dining" | "Outdoor" | undefined,
    category: product.category || undefined,
    rating: product.rating || undefined,
    reviewsCount: product.reviewsCount || undefined,
    badges: product.badges?.split("|") || [],
    descriptionHtml: product.descriptionHtml || undefined,
  }))

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {config.title}
            </h1>
            <p className="text-lg sm:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
              {config.description}
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-stone-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm">{totalCount} Products</span>
              </div>
              <div className="w-px h-6 bg-stone-700" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm">Premium Quality</span>
              </div>
              <div className="w-px h-6 bg-stone-700" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm">Curated Collection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <CategoryFilters
              availableMaterials={availableMaterials}
              availableColors={availableColors}
              availableRooms={[]}
              availableCategories={availableCategories}
              priceRange={priceRange}
              currentSort={sortBy}
              currentMinPrice={minPrice}
              currentMaxPrice={maxPrice}
              currentMaterials={materials || []}
              currentColors={colors || []}
              currentRooms={[]}
              currentCategories={categories || []}
              showCategoryFilter={true}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
              <p className="text-stone-600">
                Showing <span className="font-semibold text-stone-900">{((page - 1) * pageSize) + 1}</span> - <span className="font-semibold text-stone-900">{Math.min(page * pageSize, totalCount)}</span> of <span className="font-semibold text-stone-900">{totalCount}</span> products
              </p>
            </div>

            {/* Products Grid */}
            {transformedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transformedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {page > 1 && (
                      <a
                        href={`/collections/${slug}?page=${page - 1}`}
                        className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        Previous
                      </a>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => {
                        if (totalPages <= 7) return true
                        if (p === 1 || p === totalPages) return true
                        if (Math.abs(p - page) <= 1) return true
                        return false
                      })
                      .map((p, i, arr) => {
                        if (i > 0 && arr[i - 1] !== p - 1) {
                          return (
                            <span key={`ellipsis-${p}`} className="px-2 py-2">
                              ...
                            </span>
                          )
                        }
                        return (
                          <a
                            key={p}
                            href={`/collections/${slug}?page=${p}`}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              p === page
                                ? 'bg-stone-900 text-white'
                                : 'border border-stone-300 hover:bg-stone-50'
                            }`}
                          >
                            {p}
                          </a>
                        )
                      })}

                    {page < totalPages && (
                      <a
                        href={`/collections/${slug}?page=${page + 1}`}
                        className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        Next
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-stone-500 text-lg">No products found matching your filters.</p>
                <a
                  href={`/collections/${slug}`}
                  className="mt-4 inline-block text-stone-900 underline hover:no-underline"
                >
                  Clear all filters
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(ROOM_CONFIG).map((slug) => ({
    slug,
  }))
}
