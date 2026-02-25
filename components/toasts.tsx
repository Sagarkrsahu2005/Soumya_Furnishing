"use client"

import { useContext, createContext, useState, type ReactNode, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, AlertCircle, Info } from "lucide-react"

export type ToastType = "success" | "error" | "info"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function Toast({ toast, onRemove }: ToastProps) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <Check className="w-5 h-5 text-[#7CB342]" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Info className="w-5 h-5 text-[#4A90E2]" />
    }
  }

  const bgColor = {
    success: "bg-[#0f0f0f] border-[#7CB342]/30",
    error: "bg-[#0f0f0f] border-red-500/30",
    info: "bg-[#0f0f0f] border-[#4A90E2]/30",
  }[toast.type]

  const textColor = {
    success: "text-white",
    error: "text-white",
    info: "text-white",
  }[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl ${bgColor} ${textColor} pointer-events-auto shadow-lg`}
    >
      {getIcon()}
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
