import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CollectionContent } from '@/components/collection-content'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const prisma = new PrismaClient()

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
        variants: product.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          inventoryQuantity: v.inventoryQuantity || 0,
        })),
        category: product.category,
        badges: product.badges ? product.badges.split('|') : [],
        rating: product.rating,
        reviewsCount: product.reviewsCount,
      }
    })

    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black">
          {/* Premium Hero Section */}
          <div className="relative pt-32 pb-20 overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4A90E2]/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7CB342]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-8">
                <Link href="/" className="text-gray-500 hover:text-[#4A90E2] transition-colors">
                  Home
                </Link>
                <ChevronRight size={14} className="text-gray-600" />
                <Link href="/products" className="text-gray-500 hover:text-[#4A90E2] transition-colors">
                  Collections
                </Link>
                <ChevronRight size={14} className="text-gray-600" />
                <span className="text-white font-medium">{collection.title}</span>
              </nav>

              {/* Collection Header */}
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                  <div className="w-2 h-2 rounded-full bg-[#4A90E2] animate-pulse" />
                  <span className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">Collection</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent leading-tight">
                  {collection.title}
                </h1>

                {collection.description && (
                  <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6">
                    {collection.description}
                  </p>
                )}

                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#1a1a1a]/80 border border-white/10 rounded-full backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-white">{products.length}</span>
                  </div>
                  <span className="text-sm text-gray-500">{products.length === 1 ? "Product" : "Products"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <CollectionContent products={products} collectionTitle={collection.title} />
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error('Error loading collection:', error)
    notFound()
  }
}
