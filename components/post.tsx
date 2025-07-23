import { type Post as PostI } from "@/types/post"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { formatTimeAgo } from "@/utils/format-time"
import { MessageCircle, MoreHorizontal, Share2 } from "lucide-react"
import { reactions } from "@/config/constants"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export const Post = ({
  isAuthor,
  post,
  onReaction,
}: {
  isAuthor: boolean;
  post: PostI;
  onReaction: (reaction: "like" | "love" | "haha" | "wow" | "sad" | "angry") => Promise<void>;
}) => {
  return (
    <Card className="bg-[#2d2d2d] border-gray-700">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.avatar || ""} />
            <AvatarFallback className="bg-purple-600 text-white">
              {post.author.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{post.author.fullName}</h3>
                <p className="text-sm text-gray-400">
                  @{post.author.username} · {formatTimeAgo(post.createdAt)}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-32">
                  {
                    isAuthor ? (
                      <>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Borrar</DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem disabled>Reportar</DropdownMenuItem>
                        <DropdownMenuItem disabled>Compartir</DropdownMenuItem>
                      </>
                    )
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-white mb-3">{post.content}</p>

            {post.image && (
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post image"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {/* Reactions Display */}
            <div className="flex items-center gap-1 mb-3">
              {reactions.map(({ name, emoji }) => (
                <Badge
                  key={`badge-${name}-${post.id}`}
                  variant="secondary"
                  className={`cursor-pointer  text-gray-300  ${post.reacted?.type === name ? 'bg-blue-500 hover:bg-blue-400' : 'hover:bg-[#1a1a1a]/40 bg-[#1a1a1a]'}`}
                  asChild
                >
                  <button
                    onClick={async () => await onReaction(name)}
                  >
                    {emoji} {post.reactions[name]?.count || 0}
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-600">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {/* {post.} */}
                </Button>

                <div className="relative">
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-yellow-400"
                  >
                    <SmilePlus />
                  </Button> */}

                  {/* {showReactions && (
                    <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] border border-gray-600 rounded-lg p-2 flex gap-1">
                      {reactions.map(({ name, emoji }) => (
                        <Button
                          key={`button-${name}-${post.id}`}
                          variant="ghost"
                          size="sm"
                          onClick={async () => await onReaction(name)}
                          className="text-lg hover:bg-gray-700"
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  )} */}
                </div>
              </div>

              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}