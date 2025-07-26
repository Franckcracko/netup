import { type Post as PostI } from "@/types/post"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { formatTimeAgo } from "@/utils/format-time"
import { AlertCircle, MessageCircle, MoreHorizontal, Pencil, Share2, Trash } from "lucide-react"
import { reactions } from "@/config/constants"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { CommentsModal } from "./comments-modal"
import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"

export const Post = ({
  isAuthor,
  post,
  onReaction,
  onDelete
}: {
  isAuthor: boolean;
  post: PostI;
  onReaction: (reaction: "like" | "love" | "haha" | "wow" | "sad" | "angry") => Promise<void>;
  onDelete: () => Promise<void>;
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)

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
                <DropdownMenuContent align="center" className="w-32 bg-[#2d2d2d] border-[#212121]">
                  {
                    isAuthor ? (
                      <>
                        <DropdownMenuItem>
                          <Pencil className="w-4 h-4 mr-1" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
                          <Trash className="w-4 h-4 mr-1" />
                          Borrar
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem disabled>
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Reportar
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <Share2 className="w-4 h-4 mr-1" />
                          Compartir
                        </DropdownMenuItem>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-blue-400"
                  onClick={() => setShowCommentsModal(true)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.commentsCount}
                </Button>
                <CommentsModal
                  isOpen={showCommentsModal}
                  onChangeOpen={(value) => setShowCommentsModal(value)}
                  post={post}
                />
              </div>

              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <Dialog open={showDeleteModal} onOpenChange={(open) => setShowDeleteModal(open)}>
        <DialogContent className="bg-[#2d2d2d] border-gray-700">
          <form onSubmit={async (e) => {
            e.preventDefault();
            await onDelete()
            setShowDeleteModal(false)
          }}>
            <DialogHeader>
              <DialogTitle>
                ¿Estás seguro de que quieres eliminar este post?
              </DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. El post será eliminado permanentemente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" >Cancelar</Button>
              </DialogClose>
              <Button type="submit">Aceptar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export const PostSkeleton = () => {
  return (
    <Card className="bg-[#2d2d2d] border-gray-700 animate-pulse">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 bg-gray-600">
            <AvatarFallback className="bg-purple-600 text-white" />
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            <div className="h-6 bg-gray-600 rounded w-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}