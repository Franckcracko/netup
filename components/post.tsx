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
      </div>
    </article>
  )
}
