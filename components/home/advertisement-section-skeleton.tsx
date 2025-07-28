import { AnnouncementSkeleton } from "./announcement";

export const AdvertisementSectionSkeleton = async () => {
  return (
    <section className="mt-2">
      <h2 className="text-lg font-semibold text-white">Anuncios</h2>
      <main>
        <section className="space-y-6 mt-4">
          {[1, 2, 3, 4, 5].map((post) => (
            <AnnouncementSkeleton
              key={post}
            />
          ))}
        </section>
      </main>
    </section>
  )
}