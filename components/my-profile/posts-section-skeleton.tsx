import { PostSkeleton } from "../post"

export const PostsSectionSkeleton = () => {
  return (
    <>
      <section className="space-y-4 mt-5">
        <h2 className="text-2xl font-bold text-white mb-4">Mis Posts</h2>
        {[1, 2, 3, 4, 5].map((post) => (
          <PostSkeleton
            key={post}
          />
        ))}
      </section>
    </>
  )
}