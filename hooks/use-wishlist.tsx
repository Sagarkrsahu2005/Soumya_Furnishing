"use client"

import { useContext, createContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/types"

type WishlistItem = {
  productId: string
  product: Product
  addedAt: number
}

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (product: Product) => boolean // returns new state
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("soumya-wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (e) {
        console.error("Failed to parse wishlist", e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("soumya-wishlist", JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id)
      if (existingItem) {
        return prevItems
      }
      return [
        ...prevItems,
        {
          productId: product.id,
          product,
          addedAt: Date.now(),
        },
      ]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId)
  }

  const toggleItem = (product: Product) => {
    const inWishlist = isInWishlist(product.id)
    if (inWishlist) {
      removeItem(product.id)
      return false
    } else {
      addItem(product)
      return true
    }
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleItem }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider")
  }
  return context
}
