import { type Post as PostI } from "@/types/post"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { formatTimeAgo } from "@/utils/format-time"
import { PostOptions } from "./home/post-options"
import { PostFooter } from "./home/post-footer"
import Link from "next/link"

export const Post = ({
  post,
  onDelete
}: {
  post: PostI;
  onDelete?: (postId: string) => void;
}) => {
  return (
    <article>
      <div className="hidden md:flex p-4">
        <Avatar className="size-10 mr-3">
          <AvatarImage src={post.author.avatar || ""} />
          <AvatarFallback className="bg-purple-600 text-white">
            {post.author.username
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <header className="flex items-center justify-between mb-2">
            <Link href={`/profile/${post.author.id}`}>
              <h3 className="font-semibold text-white">{post.author.fullName}</h3>
              <p className="text-sm text-gray-400">
                @{post.author.username} · {formatTimeAgo(post.createdAt)}
              </p>
            </Link>
            <PostOptions
              postId={post.id}
              onDelete={onDelete}
            />
          </header>
          <main className="mb-3">
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
          </main>

          <PostFooter post={post} />
        </div>
      </div>
      <div className="block md:hidden p-4">
        <header className="flex items-center mb-2">
          <Avatar className="size-10 mr-3">
            <AvatarImage src={post.author.avatar || ""} />
            <AvatarFallback className="bg-purple-600 text-white">
              {post.author.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex w-full justify-between">
            <Link href={`/profile/${post.author.id}`}>
              <h3 className="font-semibold text-white">{post.author.fullName}</h3>
              <p className="text-sm text-gray-400">
                @{post.author.username} · {formatTimeAgo(post.createdAt)}
              </p>
            </Link>
            <PostOptions
              postId={post.id}
              onDelete={onDelete}
            />
          </div>
        </header>
        <main className="mb-3">
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
        </main>

        <PostFooter post={post} />
      </div>
    </article>
  )
}

export const PostSkeleton = () => {
  return (
    <article className="p-4 border-b border-gray-800 animate-pulse">
      <div className="flex items-center mb-2">
        <Avatar className="size-10 mr-3 bg-gray-700">
          <AvatarFallback className="bg-gray-600 text-white"></AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-1"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mb-3">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-40 bg-gray-700 rounded"></div>
      </div>
    </article>
  )
}