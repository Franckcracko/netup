'use client';

import { FileText, Heart, Loader, MessageCircle, MoreHorizontal, Trash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTimeAgo } from "@/utils/format-time";
import { Button } from "../ui/button";
import { useUser } from "@/hooks/use-user";
import { getPosts } from "@/data/post";
import { type Post } from "@/types/post";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostSkeleton } from "../post";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { deletePost } from "@/app/actions";

export const PostsSection = () => {
  const { user } = useUser()

  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)

  const handleLoadMoreData = async () => {
    if (!user || isLoading || totalPosts <= posts.length) return

    try {
      const { posts: newPosts, totalCount } = await getPosts({ query: `@${user.username}`, page: currentPage + 1 })
      setPosts((prev) => [...prev, ...newPosts])
      setCurrentPage((prev) => prev + 1)
      setTotalPosts(totalCount)
    } catch (error) {
      console.error("Error loading more posts:", error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))

      await deletePost(postId)
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return

      try {
        const { posts, totalCount } = await getPosts({ query: `@${user?.username}`, page: 1 })
        setPosts(posts)
        setTotalPosts(totalCount)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [user])

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <Card className="bg-[#2d2d2d] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Mis Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-700">
            {[1, 2, 3, 4, 5].map((post) => (
              <PostSkeleton key={`skeleton-${post}`} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#2d2d2d] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Mis Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">

        {posts.length > 0 ? (
          <InfiniteScroll
            dataLength={posts.length}
            next={handleLoadMoreData}
            hasMore={totalPosts > posts.length}
            loader={
              <div className="flex justify-center py-4">
                <Loader
                  className="w-6 h-6 text-purple-600 animate-spin"
                  aria-label="Cargando posts"
                />
              </div>
            }
            endMessage={
              <p
                className="text-center text-gray-500 py-5"
                aria-label="No hay más posts"
              >
                No hay más posts
              </p>
            }
          >
            <div className="divide-y divide-gray-700">
              {posts.map((post) => (
                <Post
                  key={post.id}
                  onDelete={() => handleDeletePost(post.id)}
                  post={post}
                />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-12 mx-auto">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay posts aún</h3>
            <p className="text-gray-400 mb-4">Comparte tu primer post con la comunidad</p>
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700">Crear Post</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const Post = ({
  post,
  onDelete
}: {
  post: Post
  onDelete: () => Promise<void>
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <div className="p-6">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-purple-600 text-white">
            {post.author.fullName
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
                <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
                  <Trash className="w-4 h-4 mr-1" />
                  Borrar
                </DropdownMenuItem>
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

          <div className={`flex items-center gap-4 pt-2 ${post.image ? 'border-t border-gray-600' : ''}`}>
            <div className="flex items-center gap-1 text-gray-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm">
                {
                  Object.values(post.reactions).reduce((acc, reaction) => acc + reaction.count, 0)
                }
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.commentsCount}</span>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  )
}