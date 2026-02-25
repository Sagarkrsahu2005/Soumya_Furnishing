"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
  baseUrl?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, baseUrl }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  if (totalPages <= 1) return null

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else if (baseUrl) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      router.push(`${baseUrl}?${params.toString()}`)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
      <motion.button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="group relative p-3 rounded-xl bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 text-white hover:bg-[#4A90E2] hover:border-[#4A90E2] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1a]/80 disabled:hover:border-white/10 transition-all cursor-pointer"
        aria-label="Previous page"
        whileHover={currentPage !== 1 ? { x: -4, scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
      >
        <ChevronLeft className="w-5 h-5" />
        {currentPage !== 1 && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
            Previous
          </span>
        )}
      </motion.button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <motion.button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={typeof page !== "number"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative min-w-[44px] h-11 rounded-xl font-semibold text-sm transition-all ${
              page === currentPage
                ? "bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] text-white shadow-lg shadow-[#4A90E2]/20"
                : typeof page === "number"
                  ? "bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:border-[#4A90E2]/50 hover:text-white cursor-pointer"
                  : "text-gray-600 cursor-default bg-transparent border-none"
            }`}
            whileHover={typeof page === "number" && page !== currentPage ? { scale: 1.1, y: -2 } : {}}
            whileTap={typeof page === "number" && page !== currentPage ? { scale: 0.95 } : {}}
          >
            {page}
            {page === currentPage && (
              <motion.div
                layoutId="activePage"
                className="absolute inset-0 bg-gradient-to-r from-[#4A90E2]/20 to-[#3A7BC8]/20 rounded-xl blur-lg -z-10"
              />
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group relative p-3 rounded-xl bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 text-white hover:bg-[#4A90E2] hover:border-[#4A90E2] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1a]/80 disabled:hover:border-white/10 transition-all cursor-pointer"
        aria-label="Next page"
        whileHover={currentPage !== totalPages ? { x: 4, scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
      >
        <ChevronRight className="w-5 h-5" />
        {currentPage !== totalPages && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
            Next
          </span>
        )}
      </motion.button>
    </div>
  )
}
