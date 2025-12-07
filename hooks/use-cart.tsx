"use client"

import { useContext, createContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Product } from "@/lib/types"

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, variantId?: string, quantity?: number) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("soumya-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart", e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("soumya-cart", JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (product: Product, variantId?: string, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id && item.variantId === variantId)
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [
        ...prevItems,
        {
          productId: product.id,
          variantId,
          quantity,
          product,
        },
      ]
    })
  }

  const removeItem = (productId: string, variantId?: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.productId === productId && item.variantId === variantId)))
  }

  const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.variantId === variantId ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
