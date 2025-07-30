'use server'

import { getUserStats } from "@/data/user"
import { DynamicProfile } from "./dynamic-profile"
import { User } from "@/types/user"

export const ProfileSection = async ({
  user
}: {
  user: User;
}) => {
  const stats = await getUserStats(user.email)

  if (!stats) {
    throw new Error("User stats not found")
  }

  return (
    <section className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6 rounded-lg overflow-hidden">
      <DynamicProfile
        user={user}
        postsCount={stats.postsCount}
        reactionsCount={stats.reactionsCount}
        friendsCount={stats.friendsCount}
      />
    </section>
  )
}
