"use client"

import { useEffect, useRef, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion, useScroll, useTransform } from "framer-motion"
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const glassCardsRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    // Parallax glass cards animation
    if (glassCardsRef.current) {
      const cards = glassCardsRef.current.querySelectorAll('.glass-card')
      
      gsap.fromTo(
        cards,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: glassCardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }

    // Form animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
          },
        }
      )
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    setTimeout(() => setSubmitted(false), 5000)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our friendly team is here to help",
      value: "hello@soumyafurnishings.com",
      href: "mailto:hello@soumyafurnishings.com",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 10am to 6pm IST",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      value: "Bangalore, Karnataka, India",
      href: "#map",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're here to serve you",
      value: "Mon-Sat: 10AM - 6PM",
      href: "#hours",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
  ]

  const faqs = [
    {
      question: "What are your shipping options?",
      answer: "We offer free shipping on orders over ₹5,000. Standard delivery takes 5-7 business days.",
    },
    {
      question: "Do you offer custom orders?",
      answer: "Yes! We can customize colors, sizes, and materials. Contact us to discuss your requirements.",
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of delivery for unused items in original packaging.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within India. International shipping coming soon!",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f9fdf9] via-[#f1f8f2] to-[#e8f5e9] overflow-hidden pt-20">
      <Navbar />

      {/* Hero Section with Parallax */}
      <motion.div
        ref={heroRef}
        style={{ y, opacity }}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-[#4A90E2] mb-4">Get in Touch</p>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-[#2b2b2b] mb-6 leading-tight">
              Let's Create Something
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#7CB342]">
                Beautiful Together
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#5f5f5f] max-w-2xl mx-auto">
              Whether you have a question, feedback, or just want to say hello, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Glass Morphism Contact Cards */}
      <div ref={glassCardsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.a
                key={index}
                href={method.href}
                className="glass-card group relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/40 border border-white/60 p-8 hover:bg-white/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                whileHover={{ y: -10 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A90E2]/20 to-[#7CB342]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-7 h-7 text-[#4A90E2]" />
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-[#2b2b2b] mb-2">{method.title}</h3>
                  <p className="text-sm text-[#5f5f5f] mb-3">{method.description}</p>
                  <p className="text-[#2b2b2b] font-medium">{method.value}</p>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Form and FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div ref={formRef}>
            <div className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl p-8 md:p-10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4A90E2] to-[#7CB342] flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-playfair font-bold text-[#2b2b2b]">Send a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b2b2b] mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 text-[#2b2b2b] placeholder-[#5f5f5f]/50 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2b2b2b] mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 text-[#2b2b2b] placeholder-[#5f5f5f]/50 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b2b2b] mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 text-[#2b2b2b] placeholder-[#5f5f5f]/50 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2b2b2b] mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 text-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="custom">Custom Order</option>
                      <option value="wholesale">Wholesale/Trade</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b2b2b] mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 text-[#2b2b2b] placeholder-[#5f5f5f]/50 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-5 rounded-2xl bg-gradient-to-r from-[#4A90E2] to-[#7CB342] text-white font-semibold text-lg flex items-center justify-center gap-3 hover:shadow-2xl transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 rounded-2xl bg-green-500/20 backdrop-blur-sm border border-green-500/30"
                  >
                    <p className="text-green-700 font-semibold">
                      ✨ Thank you! We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#2b2b2b] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-[#5f5f5f] text-lg">
                Quick answers to questions you may have. Can't find what you're looking for? Contact us directly!
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-[#2b2b2b] mb-3">{faq.question}</h3>
                  <p className="text-[#5f5f5f]">{faq.answer}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Info Card */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-[#4A90E2]/20 to-[#7CB342]/20 border border-white/60 rounded-3xl p-8">
              <h3 className="text-2xl font-playfair font-bold text-[#2b2b2b] mb-4">Need Immediate Help?</h3>
              <p className="text-[#5f5f5f] mb-6">
                Our customer service team is available during business hours to assist you with any urgent inquiries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+919876543210"
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm text-[#2b2b2b] font-semibold text-center hover:bg-white transition-all"
                >
                  Call Now
                </a>
                <a
                  href="mailto:hello@soumyafurnishings.com"
                  className="flex-1 px-6 py-4 rounded-2xl bg-[#2b2b2b] text-white font-semibold text-center hover:bg-[#1f1f1f] transition-all"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl overflow-hidden"
        >
          <div className="aspect-[21/9] bg-gradient-to-br from-[#4A90E2]/10 to-[#7CB342]/10 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-[#4A90E2] mx-auto mb-4" />
              <p className="text-2xl font-playfair font-semibold text-[#2b2b2b]">Bangalore, Karnataka</p>
              <p className="text-[#5f5f5f] mt-2">Visit us at our showroom</p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
