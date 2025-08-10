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

  return theme === "dark" ? (
    <button
      aria-label="Switch to light mode"
      onClick={() => setMode("light")}
      className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-black text-white border-gray-700 hover:opacity-90"
    >
      <Sun className="h-4 w-4" />
    </button>
  ) : (
    <button
      aria-label="Switch to dark mode"
      onClick={() => setMode("dark")}
      className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
    >
      <Moon className="h-4 w-4" />
    </button>
  )
}


