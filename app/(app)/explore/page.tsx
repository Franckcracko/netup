"use server"

import { Post } from "@/components/post"
import { getPosts } from "@/data/post"
import LoadMore from "@/components/explore/load-more"
import { Searcher } from "@/components/home/searcher"

export default async function ExploreScreen({
  searchParams
}: {
  searchParams: Promise<{ query?: string; }>
}) {
  const { query } = await searchParams

  const { posts } = await getPosts({ page: 1, query })

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 ">
      <Searcher />
      <section className="space-y-4 mt-4">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
          />
        ))}
      </section>
      <LoadMore query={query} />
    </main>
  )
}
