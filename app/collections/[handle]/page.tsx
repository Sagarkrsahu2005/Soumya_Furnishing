import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { ProductCard } from '@/components/product-card'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const prisma = new PrismaClient()

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  
  try {
    const collection = await (prisma as any).collection.findUnique({
      where: { handle }
    })
    
    if (!collection) {
      return { title: 'Collection Not Found' }
    }

    return {
      title: `${collection.title} | Soumya Furnishings`,
      description: collection.description || `Shop our ${collection.title} collection`,
    }
  } catch (error) {
    return { title: 'Collection' }
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  
  try {
    const collection = await (prisma as any).collection.findUnique({
      where: { handle },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true,
                variants: true,
              }
            }
          }
        }
      }
    })

    if (!collection) {
      notFound()
    }

    // Transform products
    const products = collection.products.map((pc: any) => {
      const product = pc.product
      const firstVariant = product.variants[0]
      
      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        images: product.images.map((img: any) => ({
          src: img.src,
          alt: img.alt || product.title
        })),
        category: product.category,
        inventory: firstVariant ? firstVariant.inventoryQuantity : 0
      }
    })

    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-[#7CB342] transition-colors">
                Home
              </Link>
              <ChevronRight size={16} />
              <Link href="/products" className="hover:text-[#7CB342] transition-colors">
                Products
              </Link>
              <ChevronRight size={16} />
              <span className="text-gray-900 font-medium">{collection.title}</span>
            </nav>

            {/* Collection Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                  {collection.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-4">
                {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                <div className="w-24 h-24 mb-6 text-gray-300">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-8">This collection is currently empty. Check back soon!</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#7CB342] text-white rounded-lg hover:bg-[#689F38] transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error loading collection:', error)
    notFound()
  }
}
