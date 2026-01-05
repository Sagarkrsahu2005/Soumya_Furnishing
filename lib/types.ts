export type Product = {
  id: string
  slug: string
  title: string
  sku?: string
  price: number
  compareAtPrice?: number
  currency: "INR"
  images: { src: string; alt?: string }[]
  variants?: {
    id: string
    name: string
    options: Record<string, string>
    price?: number
    compareAtPrice?: number
    sku?: string
    inventoryQuantity?: number
  }[]
  materials?: string[]
  colors?: string[]
  room?: "Living" | "Bedroom" | "Dining" | "Outdoor"
  category?: string
  rating?: number
  reviewsCount?: number
  badges?: string[]
  descriptionHtml?: string
  care?: string[]
}

export type Collection = {
  id: string
  title: string
  handle: string
  blurb?: string
  image?: string
}

export type CartItem = {
  productId: string
  variantId?: string
  quantity: number
  product: Product
}

export type Room = "Living" | "Bedroom" | "Dining" | "Outdoor"
