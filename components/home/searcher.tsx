'use client'
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const Searcher = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        router.push(`/explore?query=${query}`)
      }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          name="query"
          placeholder="Buscar posts, @usuarios..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 sm:pl-10 bg-[#2d2d2d] border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base"
        />
      </div>
    </form>
  )
}