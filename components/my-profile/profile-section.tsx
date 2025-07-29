'use server'

import { getUserStats } from "@/data/user"
import { Card, CardContent } from "../ui/card"
import { DynamicProfile } from "./dynamic-profile"

export const ProfileSection = async ({
  user
}: {
  user: {
    postsCount: number;
    friendsCount: number;
    fullName: string;
    bio: string | null;
    id: string;
    email: string;
    username: string;
    avatar: string | null;
    avatarPublicId: string | null;
    joinDate: Date;
  }
}) => {
  const stats = await getUserStats(user.email)

  if (!stats) {
    throw new Error("User stats not found")
  }

  return (
    <Card className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6 ">
      <CardContent >
        <DynamicProfile
          user={user}
          postsCount={stats.postsCount}
          reactionsCount={stats.reactionsCount}
          friendsCount={stats.friendsCount}
        />
      </CardContent>
    </Card>
  )
}
