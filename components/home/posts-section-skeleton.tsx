import { PostSkeleton } from "../post"

export const PostsSectionSkeleton = async () => {
  return (
    <section className="space-y-4 mt-5">
      {[1, 2, 3, 4, 5].map((post) => (
        <PostSkeleton
          key={post}
        />
      ))}
    </section>
  )
}