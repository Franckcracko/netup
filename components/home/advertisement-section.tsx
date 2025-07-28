'use server';

import { getRecentAnnouncements } from "@/data/post"
import { Announcement } from "./announcement";

export const AdvertisementSection = async () => {
  const { posts: advertisements } = await getRecentAnnouncements({ page: 1 })

  return (
    <section className="mt-2">
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
    </section>
  )
}