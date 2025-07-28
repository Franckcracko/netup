import { Searcher } from "@/components/home/searcher"
import { PostsSection } from "@/components/explore/posts-section"
import { Suspense } from "react";
import { PostsSectionSkeleton } from "@/components/home/posts-section-skeleton";

export default function ExploreScreen({
  searchParams
}: {
  searchParams: Promise<{ query?: string; }>
}) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6 ">
      <Searcher />
      <Suspense fallback={<PostsSectionSkeleton />}>
        <PostsSection searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
