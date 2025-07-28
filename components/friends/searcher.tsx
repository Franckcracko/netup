'use client';

import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { useState } from "react";
import { useRouter } from "next/navigation";

export const Searcher = ({ query }: { query?: string }) => {
  const [search, setSearch] = useState(query || '');
  const router = useRouter()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.replace(`/friends?query=${search}`)
      }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar amigos..."
        className="pl-10 bg-[#2d2d2d] border-gray-600 text-white placeholder-gray-400"
      />
    </form>
  )
}