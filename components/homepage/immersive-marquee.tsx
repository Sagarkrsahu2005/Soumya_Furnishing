"use client"

const marqueeData = [
  { label: "620+", description: "Handpicked Pieces" },
  { label: "24h", description: "Dispatch Promise" },
  { label: "15+", description: "Curated Collections" },
  { label: "100%", description: "Premium Fabrics" },
  { label: "Design", description: "Studio Crafted" },
]

export default function ImmersiveMarquee() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#e8f5e9] via-[#f1f8f2] to-[#e8f5e9] border-y border-[#c8e6c9] mt-16">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#4A90E2]/10 to-transparent" />

      <div className="py-8 space-y-6">
        {[false, true].map((reverse, idx) => (
          <div key={idx} className="flex overflow-hidden">
            <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
              {[...Array(2)].map((_, loopIdx) => (
                <div key={loopIdx} className="flex">
                  {marqueeData.map((item, dataIdx) => (
                    <div
                      key={`${loopIdx}-${item.label}-${dataIdx}`}
                      className="marquee-item text-[#2b2b2b]"
                    >
                      <span className="text-2xl md:text-3xl font-playfair tracking-wide">
                        {item.label}
                      </span>
                      <span className="text-sm uppercase tracking-[0.3em] text-[#6f6f6f] font-inter">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
