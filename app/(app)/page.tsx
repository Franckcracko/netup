import { PostCreator } from "@/components/home/post-creator"
import { Searcher } from "@/components/home/searcher"
import { AdvertisementSection } from "@/components/home/advertisement-section"
import { Suspense } from "react"
import { AdvertisementSectionSkeleton } from "@/components/home/advertisement-section-skeleton"
import { PostsSection } from "@/components/home/posts-section"
import { PostsSectionSkeleton } from "@/components/home/posts-section-skeleton"

export default function FeedScreen() {
  return (
    <main className="flex max-w-6xl 2xl:mx-auto min-h-screen">
      <section className="px-4 py-6 flex-1">
        <PostCreator />

        <Suspense fallback={<PostsSectionSkeleton />}>
          <PostsSection />
        </Suspense>
      </section>
      <section className="hidden xl:block border-l min-w-xs max-w-[350px] p-6">
        <Searcher />
        <Suspense fallback={<AdvertisementSectionSkeleton />}>
          <AdvertisementSection />
        </Suspense>
      </section>
    </main>
  )
}
