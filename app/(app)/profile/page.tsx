import { PostsSection } from "@/components/my-profile/posts-section"
import { PostsSectionSkeleton } from "@/components/my-profile/posts-section-skeleton"
import { ProfileSection } from "@/components/my-profile/profile-section"
import { ProfileSectionSkeleton } from "@/components/my-profile/profile-section-skeleton"
import { getUserByEmail } from "@/data/user"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { Suspense } from "react"

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

  const user = await getUserByEmail(email)

  if (!user) {
    throw new Error("User not found")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Suspense fallback={<ProfileSectionSkeleton />}>
        <ProfileSection
          user={user}
        />
      </Suspense>

      <Suspense fallback={<PostsSectionSkeleton />}>
        <PostsSection username={user.username} />
      </Suspense>
    </div>
  )
}
