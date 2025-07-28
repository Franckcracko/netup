'use server'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostFooter } from "@/components/home/post-footer"
import { getPost } from "@/data/post"

export const PostSection = async ({
  id
}: {
  id: string
}) => {
  const post = await getPost(id)

  if (!post) {
    throw new Error("Post not found")
  }

  return (
    <article className="mb-4">
      <header className="flex items-center mb-6 gap-3">
        <Avatar className="size-12">
          <AvatarImage src={post.author.avatar || ""} />
          <AvatarFallback className="bg-purple-600 text-white">
            {post.author.username
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold text-white">{post.author.fullName}</h2>
          <p className="text-gray-500">@{post.author.username} · {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </header>
      <main className="min-h-20">
        <p
          className="text-white mb-4 text-lg font-normal text-pretty leading-snug md:leading-relaxed lg:leading-loose"
        >
          {post.content}
        </p>
        {post.image && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}
      </main>
      <PostFooter post={post} />
    </article>
  )
}