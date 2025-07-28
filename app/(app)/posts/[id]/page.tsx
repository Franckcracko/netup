"use server"

import { getCommentsByPost, getPost } from "@/data/post"
import { Comment } from "@/components/post/comment/comment"
import { CommentForm } from "@/components/post/comment/comment-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostReactions } from "@/components/home/post-reactions"
import Link from "next/link"
import { LoadMore } from "@/components/post/comment/load-more"
import { PostFooter } from "@/components/home/post-footer"

export default async function PostScreen({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    throw new Error("Post ID is required")
  }

  const post = await getPost(id)

  if (!post) {
    throw new Error("Post not found")
  }

  const { comments } = await getCommentsByPost({
    postId: id,
    page: 1,
  })

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Volver a publicaciones
      </Link>
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


      <h2 className="my-4 text-2xl font-bold text-white">Comentarios</h2>
      <CommentForm postId={id} />
      {
        comments.length === 0 && (
          <p className="text-gray-500 text-center my-6">No hay comentarios aún. Sé el primero en comentar.</p>
        )
      }
      <section className="space-y-5 py-6">
        {
          comments.map((comment) => (<Comment key={`comment-${comment.id}`} comment={comment} />))
        }
      </section>
      <LoadMore postId={id} />
    </main>
  )
}
