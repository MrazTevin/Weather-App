"use client"

import { useState, type FormEvent } from "react"
import { Search } from "lucide-react"

interface SearchBoxProps {
  onSearch: (city: string) => void
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        placeholder="Search city..."
        className="input input-bordered w-full pr-10 bg-white/20 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 transition-colors duration-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-300"
        aria-label="Search"
      >
        <Search size={18} />
      </button>
    </form>
  )
}
