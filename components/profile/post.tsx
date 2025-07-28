import { type Post as PostI } from "@/types/post"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { formatTimeAgo } from "@/utils/format-time"
import Link from "next/link"

export const Post = ({
  post,
}: {
  post: PostI;
}) => {
  return (
    <Link href={`/posts/${post.id}`}>
      <article className="hover:bg-[#252525] transition-colors rounded-md">
        <div className="p-4">
          <div className="flex">
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
            </div>
          </div>
        </div>
      </article>
    </Link>

  )
}
