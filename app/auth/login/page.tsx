"use client"

import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Chrome, ShoppingBag, Shield, Sparkles, Zap, Lock, ArrowLeft } from "lucide-react"
import { Suspense } from "react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/account"

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10 pt-33.5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600 rounded-2xl shadow-2xl shadow-emerald-500/50 mb-6 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl blur opacity-50 animate-pulse" />
              <ShoppingBag className="text-white relative z-10" size={40} strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Soumya</span>
            </h1>
            <p className="text-gray-400 text-lg">Sign in to continue shopping</p>
          </div>

          {/* Google Sign In Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 relative overflow-hidden"
          >
            {/* Gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            
            <button
              onClick={handleGoogleSignIn}
              className="w-full relative group overflow-hidden bg-white hover:bg-gray-50 text-gray-900 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 font-semibold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-3">
                <Chrome className="text-emerald-600" size={24} />
                <span className="text-lg">Continue with Google</span>
              </div>
            </button>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 group hover:bg-white/5 p-3 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">Secure Authentication</p>
                  <p className="text-gray-500 text-sm">Protected by Google</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 group hover:bg-white/5 p-3 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">Lightning Fast</p>
                  <p className="text-gray-500 text-sm">Instant checkout & tracking</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 group hover:bg-white/5 p-3 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">Personalized Experience</p>
                  <p className="text-gray-500 text-sm">Save preferences & addresses</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Back to Store */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6"
          >
            <Link 
              href="/" 
              className="text-gray-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-2 font-medium group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Continue shopping as guest</span>
            </Link>
          </motion.div>

          {/* Privacy Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-gray-500 text-center mt-8 px-4 leading-relaxed"
          >
            By signing in, you agree to our <span className="text-emerald-400">Terms of Service</span> and <span className="text-emerald-400">Privacy Policy</span>.<br />
            Your data is secure and never shared with third parties.
          </motion.p>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
