import { Navbar } from "@/components/navbar"
import HeroParallax from "@/components/hero-parallax"
import BrandPhilosophy from "@/components/homepage/brand-philosophy"
import FeaturedCollections from "@/components/homepage/featured-collections"
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
      <LifestyleShowcase />
      <WhySoumya />
      <PinterestGrid />
      <FinalCTA />
      <Footer />
    </main>
  )
}
