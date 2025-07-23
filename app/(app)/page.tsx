"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, ImageIcon, Send, Loader } from "lucide-react"
import Link from "next/link"
import { usePost } from "@/hooks/use-post"
import { Post, PostSkeleton } from "@/components/post"
import { useUser } from "@/hooks/use-user"

export default function Dashboard() {
  const {
    handleChangeQuery,
    handleCreatePost,
    handleReaction,
    handleDeletePost,
    searchQuery,
    posts,
    isLoading,
    isLoadingData
  } = usePost()

  const user = useUser()

  const [newPost, setNewPost] = useState("")

  if (isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder="Buscar posts, usuarios..."
              value={searchQuery}
              onChange={(e) => handleChangeQuery(e.target.value)}
              className="pl-9 sm:pl-10 bg-[#2d2d2d] border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Create Post */}
        <Card className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <AvatarFallback className="bg-purple-600 text-white text-xs sm:text-sm">
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Textarea
                  placeholder="¿Qué está pasando?"
                  className="bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 resize-none text-sm sm:text-base"
                  rows={3}
                  maxLength={280}
                />
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 sm:p-2">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <span className="text-xs sm:text-sm text-gray-400">{newPost.length}/280</span>
                  </div>
                  <Button
                    disabled={!newPost.trim()}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm px-3 sm:px-4 text-white"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden md:inline">Publicar</span>
                    <span className="md:hidden">Post</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mt-5">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>

    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            placeholder="Buscar posts, usuarios..."
            value={searchQuery}
            onChange={(e) => handleChangeQuery(e.target.value)}
            className="pl-9 sm:pl-10 bg-[#2d2d2d] border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Create Post */}
      <Card className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-purple-600 text-white text-xs sm:text-sm">
                {user?.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Textarea
                placeholder="¿Qué está pasando?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 resize-none text-sm sm:text-base"
                rows={3}
                maxLength={280}
              />
              <div className="flex items-center justify-between mt-2 sm:mt-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1 sm:p-2">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <span className="text-xs sm:text-sm text-gray-400">{newPost.length}/280</span>
                </div>
                <Button
                  onClick={async () => {
                    if (isLoading) return
                    if (!user) return

                    await handleCreatePost({
                      content: newPost,
                      user
                    })
                    setNewPost("")
                  }}
                  disabled={!newPost.trim()}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm px-3 sm:px-4 text-white"
                >
                  {
                    isLoading ? (
                      <>
                        <Loader className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                        <span className="hidden md:inline">Enviando</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden md:inline">Publicar</span>
                        <span className="md:hidden">Post</span>
                      </>
                    )
                  }
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="mt-5">
        {
          posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <Post
                  key={post.id}
                  isAuthor={post.author.id === user?.id}
                  post={post}
                  onDelete={async () => await handleDeletePost(post.id)}
                  onReaction={async (reaction) => await handleReaction(index, reaction, user?.id || "")}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay posts de amigos</h3>
              <p className="text-gray-400 mb-4">Agrega amigos para ver sus publicaciones aquí</p>
              <Link href="/friends">
                <Button className="bg-purple-600 hover:bg-purple-700">Buscar Amigos</Button>
              </Link>
            </div>
          )
        }
      </div>
    </div>
  )
}
