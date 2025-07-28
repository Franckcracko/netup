'use client';

import { Post } from "@/types/post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { Link, Share2 } from "lucide-react";

export const SharedButton = ({ post }: { post: Post }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400 cursor-pointer">
          <Share2 className="w-4 h-4" />
          <span className="max-sm:hidden">
            Compartir
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
          }}
        >
          <Link className="w-4 h-4 mr-2" />
          Copiar URL
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}