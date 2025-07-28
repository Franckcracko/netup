import LoadMore from "@/components/my-profile/load-more"
import { Post } from "@/components/my-profile/post"
import { ProfileSection } from "@/components/my-profile/profile-section"
import { getPosts } from "@/data/post"
import { getUserByEmail, getUserStats } from "@/data/user"
import { auth, clerkClient } from "@clerk/nextjs/server"

export default async function Profile() {
  const authObject = await auth()

  if (!authObject.userId) {
    throw new Error("User is not authenticated")
  }

  const clerk = await clerkClient()

  const userClerk = await clerk.users.getUser(authObject.userId)

  if (!userClerk) {
    throw new Error("User not found")
  }

  const email = userClerk.emailAddresses[0].emailAddress

  const stats = await getUserStats(email)

  if (!stats) {
    throw new Error("User stats not found")
  }

  const user = await getUserByEmail(email)

  if (!user) {
    throw new Error("User not found")
  }

  const query = `@${user.username}`

  const { posts } = await getPosts({ query, page: 1 })

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ProfileSection
        friendsCount={stats.friendsCount}
        postsCount={stats.postsCount}
        reactionsCount={stats.reactionsCount}
      />

      <section className="space-y-4 mt-5">
        <h2 className="text-2xl font-bold text-white mb-4">Mis Posts</h2>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
          />
        ))}
      </section>
      <LoadMore query={query} />
    </div>
  )
}
