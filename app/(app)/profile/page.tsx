import { PostsSection } from "@/components/profile/posts-section"
import { ProfileSection } from "@/components/profile/profile-section"
import { getUserStats } from "@/data/user"
import { auth, clerkClient } from "@clerk/nextjs/server"

export default async function Profile() {
  const authObject = await auth()

  if (!authObject.userId) {
    throw new Error("User is not authenticated")
  }

  const clerk = await clerkClient()

  const user = await clerk.users.getUser(authObject.userId)

  if (!user) {
    throw new Error("User not found")
  }

  const stats = await getUserStats(user.emailAddresses[0].emailAddress)

  if (!stats) {
    throw new Error("User stats not found")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ProfileSection
        friendsCount={stats.friendsCount}
        postsCount={stats.postsCount}
        reactionsCount={stats.reactionsCount}
      />

      <PostsSection />
    </div>
  )
}
