"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

type ThemeOption = "light" | "dark"
const THEME_STORAGE_KEY = "cohustle-theme"

function applyTheme(theme: ThemeOption) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeOption>("dark")

  useEffect(() => {
    // Initialize from localStorage; default to dark if none
    const saved = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeOption) || "dark"
    setTheme(saved)
    applyTheme(saved)
  }, [])

  const setMode = (next: ThemeOption) => {
    setTheme(next)
    localStorage.setItem(THEME_STORAGE_KEY, next)
    applyTheme(next)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="Light mode"
        onClick={() => setMode("light")}
        className={`h-9 w-9 inline-flex items-center justify-center rounded-md border transition-colors ${
          theme === "light"
            ? "bg-white text-yellow-600 border-yellow-300 dark:bg-gray-900 dark:text-yellow-400"
            : "bg-white text-gray-600 border-gray-200 hover:text-yellow-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-yellow-400"
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        aria-label="Dark mode"
        onClick={() => setMode("dark")}
        className={`h-9 w-9 inline-flex items-center justify-center rounded-md border transition-colors ${
          theme === "dark"
            ? "bg-black text-white border-gray-700"
            : "bg-white text-gray-600 border-gray-200 hover:text-white hover:bg-black"
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  )
}


