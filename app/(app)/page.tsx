"use server"

import { Post } from "@/components/post"
import { getPostsFollowing, getRecentAnnouncements } from "@/data/post"
import { PostCreator } from "@/components/home/post-creator"
import LoadMore from "@/components/home/load-more"
import { Searcher } from "@/components/home/searcher"
import { Announcement } from "@/components/home/announcement"

export default async function FeedScreen() {
  const { posts } = await getPostsFollowing({ page: 1 })
  const { posts: advertisements } = await getRecentAnnouncements({ page: 1 })

  return (
    <main className="flex max-w-6xl 2xl:mx-auto">
      <section className="px-4 py-6 flex-1">
        <PostCreator />

        <section className="space-y-4 mt-5">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
            />
          ))}
        </section>
        <LoadMore />
      </section>
      <section className="hidden xl:block border-l min-w-xs max-w-[350px] p-6">
        <Searcher />
        <article className="mt-2">
          <h2 className="text-lg font-semibold text-white">Anuncios</h2>
          <main>
            <section className="space-y-6 mt-4">
              {
                advertisements.length === 0 && (
                  <p className="text-gray-400">Sin novedades</p>
                )
              }
              {advertisements.map((post) => (
                <Announcement
                  key={post.id}
                  post={post}
                />
              ))}
            </section>
          </main>
        </article>
      </section>
    </main>
  )
}
