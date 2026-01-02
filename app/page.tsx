import { Navbar } from "@/components/navbar"
import HeroParallax from "@/components/hero-parallax"
import ImmersiveMarquee from "@/components/homepage/immersive-marquee"
import TopCategories from "@/components/homepage/top-categories"
import CuratedProducts from "@/components/homepage/curated-products"
import ShopByRoom from "@/components/shop-by-room"
import FeaturedProductsGrid from "@/components/homepage/featured-products-grid"
import KalkisFavourites from "@/components/homepage/kalkis-favourites"
import TestimonialsParallax from "@/components/homepage/testimonials-parallax"
import WhySoumya from "@/components/homepage/why-soumya"
import FinalCTA from "@/components/homepage/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f2] to-[#e8f5e9] overflow-hidden">
      <Navbar />
      <HeroParallax />
      <ImmersiveMarquee />
      <TopCategories />
      <CuratedProducts />
      <ShopByRoom />
      <KalkisFavourites />
      <FeaturedProductsGrid />
      <TestimonialsParallax />
      <WhySoumya />
      <FinalCTA />
      <Footer />
    </main>
  )
}
