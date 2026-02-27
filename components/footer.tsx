import Link from "next/link"
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-[#0a0a0a] via-[#000000] to-[#0a0a0a] text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#c8b27c] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#9dafa2] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
          {/* Brand - Larger on left */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-semibold mb-3 md:mb-4">
                <span className="text-white">Soumya</span>
                <span className="text-[#c8b27c]"> Furnishings</span>
              </h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md">
                Elevate your everyday with artisan-crafted home décor from India. Premium materials, sustainable practices, and timeless design.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[#c8b27c]">Stay Inspired</p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#c8b27c] text-sm touch-manipulation"
                />
                <button className="px-6 py-3 rounded-full bg-[#c8b27c] text-[#2b2b2b] text-sm font-semibold hover:bg-[#d9c4a3] active:scale-95 transition-all duration-300 touch-manipulation whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-4">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#4A90E2] hover:text-white hover:border-[#4A90E2] active:scale-95 transition-all duration-300 touch-manipulation"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#4A90E2] hover:text-white hover:border-[#4A90E2] active:scale-95 transition-all duration-300 touch-manipulation"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links - Split into 3 columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* Shop */}
            <div>
              <h4 className="font-playfair text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">Shop</h4>
              <ul className="space-y-2 md:space-y-3 text-sm">
                <li>
                  <Link href="/products" className="text-white/70 hover:text-[#4A90E2] transition-colors inline-block py-1 touch-manipulation">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/collections/bed-linen" className="text-white/70 hover:text-[#4A90E2] transition-colors inline-block py-1 touch-manipulation">
                    Bedding
                  </Link>
                </li>
                <li>
                  <Link href="/collections/cushion" className="text-white/70 hover:text-[#4A90E2] transition-colors inline-block py-1 touch-manipulation">
                    Cushions
                  </Link>
                </li>
                <li>
                  <Link href="/collections/curtains" className="text-white/70 hover:text-[#4A90E2] transition-colors inline-block py-1 touch-manipulation">
                    Curtains
                  </Link>
                </li>
                <li>
                  <Link href="/collections/rugs" className="text-white/70 hover:text-[#4A90E2] transition-colors inline-block py-1 touch-manipulation">
                    Rugs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-playfair text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-white/70 hover:text-[#4A90E2] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-[#4A90E2] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="text-white/70 hover:text-[#4A90E2] transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-[#4A90E2] transition-colors">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-[#4A90E2] transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-6 text-white">Get in Touch</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-1 text-[#4A90E2] flex-shrink-0" />
                  <a href="mailto:hello@soumya.com" className="text-white/70 hover:text-[#4A90E2] transition-colors">
                    hello@soumya.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-1 text-[#4A90E2] flex-shrink-0" />
                  <a href="tel:+919876543210" className="text-white/70 hover:text-[#4A90E2] transition-colors">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-[#4A90E2] flex-shrink-0" />
                  <span className="text-white/70">Bangalore, India</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/50">
              &copy; {currentYear} Soumya Furnishings. Crafted with care in India.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-white/50 hover:text-[#4A90E2] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/50 hover:text-[#4A90E2] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/50 hover:text-[#4A90E2] transition-colors">
                Shipping
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
