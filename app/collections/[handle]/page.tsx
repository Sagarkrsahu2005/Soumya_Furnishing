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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 px-4">
                <div className="w-32 h-32 mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/20 to-[#7CB342]/20 rounded-full blur-2xl" />
                  <div className="relative w-full h-full rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Collection Coming Soon</h3>
                <p className="text-gray-400 mb-10 text-center max-w-md leading-relaxed">
                  We're curating beautiful pieces for this collection. Check back soon for stunning new additions.
                </p>
                <Link
                  href="/products"
                  className="group relative px-8 py-3.5 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] text-white rounded-xl font-medium overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7CB342] to-[#689F38] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    Explore All Products
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            ) : (
              <>
                {/* Filter/Sort Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Showing</p>
                    <p className="text-lg font-semibold text-white">
                      {products.length} <span className="text-gray-600">handpicked {products.length === 1 ? 'piece' : 'pieces'}</span>
                    </p>
                  </div>
                </div>

                {/* Premium Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Collection CTA */}
                <div className="mt-20 pt-16 border-t border-white/5">
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Looking for something specific?
                    </h3>
                    <p className="text-gray-400 mb-8">
                      Explore our complete catalog or get in touch for custom orders
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/products"
                        className="group px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          View All Products
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                      <Link
                        href="/contact"
                        className="group px-8 py-3.5 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] hover:from-[#7CB342] hover:to-[#689F38] text-white rounded-xl font-medium transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Contact Us
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
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
