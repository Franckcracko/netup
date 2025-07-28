import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { formatTimeAgo } from "@/utils/format-time"
import { Post } from "@/types/post"

export const Announcement = ({ post }: { post: Post }) => {
  return (
    <article className="border-b">
      <header className="flex mb-2 items-center">
        <Avatar className="size-10 mr-3">
          <AvatarImage src={post.author.avatar || ""} />
          <AvatarFallback className="bg-purple-600 text-white">
            {post.author.username
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-white">{post.author.fullName}</h3>
          <p className="text-sm text-gray-400">
            @{post.author.username} · {formatTimeAgo(post.createdAt)}
          </p>
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
    </article >
  )
}

export const AnnouncementSkeleton = () => {
  return (
    <article className="border-b animate-pulse">
      <header className="flex mb-2 items-center">
        <Avatar className="size-10 mr-3">
          <AvatarFallback className="bg-gray-600 "></AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-white bg-gray-700 w-32 h-4 mb-1"></h3>
          <p className="text-sm text-gray-400 bg-gray-700 w-24 h-3"></p>
        </div>
      </header>
      <main className="mb-3">
        <p className="text-white mb-3 bg-gray-700 w-full h-4"></p>
        <div className="mb-3 rounded-lg overflow-hidden bg-gray-700 w-full h-64"></div>
      </main>
    </article>
  )
}