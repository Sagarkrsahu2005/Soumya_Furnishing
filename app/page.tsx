import { Navbar } from "@/components/navbar"
import HeroParallax from "@/components/hero-parallax"
import BrandPhilosophy from "@/components/homepage/brand-philosophy"
import FeaturedCollections from "@/components/homepage/featured-collections"
import FeaturedProductStrip from "@/components/featured-product-strip"
import ShopByRoom from "@/components/shop-by-room"
import LifestyleGallery from "@/components/lifestyle-gallery"
import LifestyleShowcase from "@/components/homepage/lifestyle-showcase"
import WhySoumya from "@/components/homepage/why-soumya"
import PinterestGrid from "@/components/homepage/pinterest-grid"
import FinalCTA from "@/components/homepage/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-white overflow-hidden">
      <Navbar />
      <HeroParallax />
      <BrandPhilosophy />
      <FeaturedCollections />
      <FeaturedProductStrip />
      <ShopByRoom />
      <LifestyleGallery />
      <LifestyleShowcase />
      <WhySoumya />
      <PinterestGrid />
      <FinalCTA />
      <Footer />
    </main>
  )
}
