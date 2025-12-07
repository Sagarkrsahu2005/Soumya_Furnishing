import Link from "next/link"
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-charcoal text-white mt-20 md:mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">
              <span className="text-white">Soumya</span>
              <span className="text-accent-gold"> Furnishings</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Elevate your everyday with artisan-crafted home décor from India. Premium materials, sustainable
              practices, and timeless design.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/products" className="hover:text-accent-gold transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?room=Living" className="hover:text-accent-gold transition-colors">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/products?room=Bedroom" className="hover:text-accent-gold transition-colors">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/products?room=Dining" className="hover:text-accent-gold transition-colors">
                  Dining
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-accent-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-accent-gold transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-gold transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@soumya.com" className="hover:text-accent-gold transition-colors">
                  hello@soumya.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+919876543210" className="hover:text-accent-gold transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-400">&copy; {currentYear} Soumya Furnishings. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="text-gray-300 hover:text-accent-gold transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="text-gray-300 hover:text-accent-gold transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
