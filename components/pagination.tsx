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
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded border border-brand-sand text-brand-charcoal hover:bg-brand-sand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((page, index) => (
        <motion.button
          key={index}
          onClick={() => typeof page === "number" && handlePageChange(page)}
          disabled={typeof page !== "number"}
          className={`w-10 h-10 rounded transition-all ${
            page === currentPage
              ? "bg-accent-gold text-white font-semibold"
              : typeof page === "number"
                ? "border border-brand-sand text-brand-charcoal hover:bg-brand-sand/20"
                : "text-brand-charcoal/50 cursor-default"
          }`}
          whileHover={typeof page === "number" && page !== currentPage ? { scale: 1.05 } : {}}
        >
          {page}
        </motion.button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded border border-brand-sand text-brand-charcoal hover:bg-brand-sand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
