"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface Tab {
  label: string
  content: string | string[]
}

interface ProductTabsProps {
  tabs: Tab[]
}

// Parse HTML table from description and convert to structured data
function parseTableFromHtml(html: string): { label: string; value: string }[] | null {
  if (!html.includes('<table')) return null
  
  const rows: { label: string; value: string }[] = []
  const tableMatch = html.match(/<table[^>]*>(.*?)<\/table>/is)
  if (!tableMatch) return null
  
  const trMatches = tableMatch[1].matchAll(/<tr[^>]*>(.*?)<\/tr>/gis)
  for (const trMatch of trMatches) {
    const tdMatches = Array.from(trMatch[1].matchAll(/<td[^>]*>(.*?)<\/td>/gis))
    if (tdMatches.length >= 2) {
      const label = tdMatches[0][1].trim()
      const value = tdMatches[1][1].trim()
      if (label && value) {
        rows.push({ label, value })
      }
    }
  }
  
  return rows.length > 0 ? rows : null
}

// Extract plain text from HTML
function stripHtml(html: string): string {
  return html.replace(/<table[^>]*>.*?<\/table>/gis, '').replace(/<[^>]+>/g, '').trim()
}

export function ProductTabs({ tabs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="border-t border-white/10 pt-8 md:pt-12">
      {/* Tab Buttons */}
      <div className="flex gap-1 md:gap-2 border-b border-white/10 mb-6 md:mb-8 flex-wrap">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 md:px-6 py-3 md:py-4 font-medium text-sm md:text-base transition-all border-b-2 -mb-px ${
              index === activeTab
                ? "border-[#4A90E2] text-[#4A90E2]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-gray-300"
      >
        {Array.isArray(tabs[activeTab].content) ? (
          <ul className="space-y-2 list-disc list-inside">
            {tabs[activeTab].content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (() => {
          const content = tabs[activeTab].content
          const tableData = typeof content === 'string' ? parseTableFromHtml(content) : null
          const textContent = typeof content === 'string' ? stripHtml(content) : content

          return (
            <div className="space-y-6">
              {textContent && (
                <p className="leading-relaxed text-base">{textContent}</p>
              )}
              
              {tableData && (
                <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#4A90E2]/10 to-transparent px-6 py-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">Product Specifications</h3>
                  </div>
                  <div className="divide-y divide-white/10">
                    {tableData.map((row, index) => (
                      <div 
                        key={index}
                        className="grid grid-cols-2 gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2]"></span>
                          {row.label}
                        </div>
                        <div className="text-gray-300">{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </motion.div>
    </div>
  )
}
