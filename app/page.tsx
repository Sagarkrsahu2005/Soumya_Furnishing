import { Navbar } from "@/components/navbar"
import { HeroBanner } from "@/components/hero-banner"
import { RoomTiles } from "@/components/room-tiles"
import { CollectionsCarousel } from "@/components/collections-carousel"
import { WhyUsCards } from "@/components/why-us-cards"
import { UGCGrid } from "@/components/ugc-grid"
import { NewsletterBlock } from "@/components/newsletter-block"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-ivory">
      <Navbar />
      <HeroBanner />
      <RoomTiles />
      <CollectionsCarousel />
      <WhyUsCards />
      <UGCGrid />
      <NewsletterBlock />
      <Footer />
    </main>
  )
}
