// Organized collection categories for navigation
export const collectionCategories = {
  bedding: {
    title: "Bedding",
    collections: [
      "Bed Linen",
      "Bed Covers Plain",
      "Bed Covers Woven",
      "Printed Bedsheets",
      "Warm Bedsheets",
      "Pillow Covers",
      "Oblong Pillows",
      "Bolster Covers",
      "Comforters"
    ]
  },
  curtains: {
    title: "Curtains & Drapes",
    collections: [
      "Curtains",
      "Plain Curtains",
      "Printed Curtains",
      "Linen voile",
      "Sheer Curtains Plain",
      "Sheer Curtains Embroidery",
      "Sheer Printed Curtains"
    ]
  },
  cushions: {
    title: "Cushions & Covers",
    collections: [
      "Cushion Cover"
    ]
  },
  tableLinen: {
    title: "Table Linen",
    collections: [
      "Table covers",
      "Table Covers Plain",
      "Table Covers Printed",
      "Table Runner",
      "Table Napkins",
      "Napkins",
      "Table Placemats"
    ]
  },
  kitchen: {
    title: "Kitchen Textiles",
    collections: [
      "Kitchen Linen",
      "Aprons",
      "Oven Mittens",
      "Pot Holder",
      "Pot Holder and Mittens"
    ]
  },
  rugs: {
    title: "Rugs & Mats",
    collections: [
      "Rugs",
      "Round Rugs",
      "Door mats",
      "Mats",
      "Yoga Mat"
    ]
  },
  living: {
    title: "Living Room",
    collections: [
      "Diwan Set",
      "Diwan sets",
      "Sofa Throws"
    ]
  },
  special: {
    title: "Special Collections",
    collections: [
      "Best Seller",
      "NEW",
      "Christmas",
      "Jacquard Woven",
      "New Collection By Soumya Furnishungs",
      "manan"
    ]
  },
  priceRanges: {
    title: "Shop by Price",
    collections: [
      "LESS 1000",
      "MORE 1000",
      "Less than 1000",
      "Greater than 1000"
    ]
  },
  accessories: {
    title: "Accessories",
    collections: [
      "Accessories"
    ]
  }
}

// Helper function to get collection category
export function getCollectionCategory(collectionTitle: string): string | null {
  for (const [key, category] of Object.entries(collectionCategories)) {
    if (category.collections.includes(collectionTitle)) {
      return key
    }
  }
  return null
}

// Helper function to get all collections in a category
export function getCollectionsByCategory(categoryKey: string): string[] {
  return collectionCategories[categoryKey as keyof typeof collectionCategories]?.collections || []
}
