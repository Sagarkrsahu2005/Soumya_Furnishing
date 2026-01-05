import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#558B2F] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Category Not Found</h2>
        <p className="text-gray-600 mb-8">
          The category you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button variant="default" className="bg-[#7CB342] hover:bg-[#558B2F]">
              Browse All Products
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
