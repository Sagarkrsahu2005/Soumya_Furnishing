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
        className="group relative p-3 rounded-lg border-2 border-brand-sand text-brand-charcoal hover:bg-accent-gold hover:text-white hover:border-accent-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Previous page"
        whileHover={currentPage !== 1 ? { x: -4, scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Previous
        </span>
      </motion.button>

      {getPageNumbers().map((page, index) => (
        <motion.button
          key={index}
          onClick={() => typeof page === "number" && handlePageChange(page)}
          disabled={typeof page !== "number"}
          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
            page === currentPage
              ? "bg-brand-charcoal text-white shadow-lg ring-2 ring-accent-gold"
              : typeof page === "number"
                ? "border-2 border-brand-sand text-brand-charcoal hover:bg-brand-sand/30 hover:border-accent-gold cursor-pointer"
                : "text-brand-charcoal/50 cursor-default"
          }`}
          whileHover={typeof page === "number" && page !== currentPage ? { scale: 1.1, y: -2 } : {}}
          whileTap={typeof page === "number" && page !== currentPage ? { scale: 0.95 } : {}}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group relative p-3 rounded-lg border-2 border-brand-sand text-brand-charcoal hover:bg-accent-gold hover:text-white hover:border-accent-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        aria-label="Next page"
        whileHover={currentPage !== totalPages ? { x: 4, scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
      >
        <ChevronRight className="w-5 h-5" />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Next
        </span>
      </motion.button>
    </div>
  )
}
