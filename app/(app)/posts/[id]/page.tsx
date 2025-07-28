"use server"

import Link from "next/link"
import { Suspense } from "react"
import { PostSection } from "@/components/post/post-section"
import { PostSkeleton } from "@/components/post"
import { CommentSection, CommentSectionSkeleton } from "@/components/post/comment/comment-section"

export default async function PostScreen({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    throw new Error("Post ID is required")
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Volver a publicaciones
      </Link>

      <Suspense fallback={<PostSkeleton />}>
        <PostSection id={id} />
      </Suspense>

      <Suspense fallback={<CommentSectionSkeleton />}>
        <CommentSection postId={id} />
      </Suspense>
    </main>
  )
}
