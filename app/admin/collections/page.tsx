"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react"
import Link from "next/link"

interface Collection {
  id: string
  handle: string
  title: string
  description: string | null
  products: any[]
  createdAt: string
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/collections")
      .then(r => r.json())
      .then(data => {
        setCollections(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600 mt-2">Organize products into collections</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            Loading collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No collections found
          </div>
        ) : (
          collections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FolderOpen className="text-blue-600" size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {collection.title}
                </h3>
                
                {collection.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {collection.products.length} products
                  </span>
                  <Link
                    href={`/collections/${collection.handle}`}
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
