"use client"

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const testimonials = [
  {
    name: "Ananya I.",
    title: "Mumbai",
    quote:
      "Every room feels softer. The layering guide and textures made my apartment look like a boutique stay.",
  },
  {
    name: "Vikram & Deeya",
    title: "Bengaluru",
    quote:
      "Curtains drape beautifully and filter light exactly as promised. Delivery felt concierge-level.",
  },
  {
    name: "Saloni K.",
    title: "Hyderabad",
    quote:
      "We built a gifting closet with Soumya staples. Packaging, finish, everything screams understated luxury.",
  },
  {
    name: "Priya M.",
    title: "Delhi",
    quote:
      "The attention to detail is remarkable. From the hand-stitched edges to the luxurious fabrics, everything exceeds expectations.",
  },
  {
    name: "Arjun & Meera",
    title: "Pune",
    quote:
      "Our bedroom transformation is complete. The linen sheets and velvet cushions have elevated our entire space.",
  },
  {
    name: "Kavya R.",
    title: "Chennai",
    quote:
      "I've been recommending Soumya to all my friends. The quality is exceptional and the designs are timeless.",
  },
  {
    name: "Rohan S.",
    title: "Gurgaon",
    quote:
      "Perfect for our minimalist home. The neutral palette and premium materials blend seamlessly with our aesthetic.",
  },
  {
    name: "Natasha & Kabir",
    title: "Mumbai",
    quote:
      "The dining linen set made our dinner parties feel extra special. Guests always ask where we got them from.",
  },
]

export default function TestimonialsParallax() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-br from-[#e8f5e9] via-[#f9fdf9] to-[#f1f8f2]">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-[#4A90E2]">Stories</p>
          <h2 className="text-4xl md:text-5xl font-playfair text-[#2b2b2b] leading-tight">
            Homes that feel curated, calm, collected
          </h2>
        </div>

        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </section>
  )
}
