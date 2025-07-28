"use server"

import { getPostsByUser } from "@/data/post"
import { Post } from "@/components/post"
import { ProfileSection } from "@/components/profile/profile-section"
import { getUser, getUserStats } from "@/data/user"

export default async function PostScreen({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    throw new Error("Post ID is required")
  }

  const { posts } = await getPostsByUser({
    userId: id,
    page: 1,
  })

  const { user, isFriend, isRequested, request, isMyProfile } = await getUser(id)

  if (!user) {
    throw new Error("User not found")
  }

  const stats = await getUserStats(user.email)

  if (!stats) {
    throw new Error("User stats not found")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ProfileSection
        isMyProfile={isMyProfile}
        user={user}
        request={request}
        isRequested={isRequested}
        isFriend={isFriend}
        friendsCount={stats.friendsCount}
        postsCount={stats.postsCount}
        reactionsCount={stats.reactionsCount}
      />

      <section className="space-y-4 mt-5">
        <h2 className="text-2xl font-bold text-white mb-4">Posts</h2>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
          />
        ))}
      </section>
      {/* <LoadMore query={query} /> */}
    </div>
  )
}
