"use client"

import { useState } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, Download } from "lucide-react"
import Link from "next/link"

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error(error)
      alert("Failed to import products")
    } finally {
      setImporting(false)
    }
  }

  const downloadSample = () => {
    const sampleCSV = `ID,Title,Slug,Price,Compare At Price,Category,Inventory,Status,Description
,Sample Product 1,sample-product-1,1999,,Cushion Covers,50,active,"Beautiful cushion cover"
,Sample Product 2,sample-product-2,2999,3499,Bedding,25,active,"Premium bedding set"`

    const blob = new Blob([sampleCSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products-sample.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/admin/products"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Products
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Import Products</h1>
        <p className="text-gray-600 mt-2">Upload a CSV file to bulk import products</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>First row should contain column headers</li>
              <li>Required columns: Title, Slug, Price</li>
              <li>Optional columns: Compare At Price, Category, Inventory, Status, Description</li>
              <li>Leave ID column empty for new products</li>
              <li>Maximum file size: 10MB</li>
            </ul>
            <button
              onClick={downloadSample}
              className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <Download size={16} />
              Download Sample CSV
            </button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="max-w-2xl mx-auto">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#7CB342] transition-colors">
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Choose a CSV file or drag it here
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Supported format: CSV (up to 10MB)
              </p>
              <label className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all cursor-pointer">
                <FileText size={20} />
                Select File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4">
                  <FileText className="text-[#7CB342]" size={40} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Upload size={20} />
                  {importing ? "Importing..." : "Import Products"}
                </button>
                <button
                  onClick={() => setFile(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Import Results</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-green-700">Successfully Imported</p>
                  <p className="text-2xl font-bold text-green-900">{result.success}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={24} />
                <div>
                  <p className="text-sm text-red-700">Failed</p>
                  <p className="text-2xl font-bold text-red-900">{result.failed}</p>
                </div>
              </div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Errors:</h4>
              <div className="bg-red-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {result.errors.map((error, i) => (
                    <li key={i} className="text-sm text-red-700">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Link
              href="/admin/products"
              className="bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              View Products
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
