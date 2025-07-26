'use server'
import { prisma } from '@/lib/db'

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export const getUserStats = async (email: string) => {
  const user = await getUserByEmail(email)
  if (!user) return null

  const [postsCount, reactionsCount, friendsCount] = await Promise.all([
    prisma.post.count({ where: { userId: user.id } }),
    prisma.reaction.count({ where: { userId: user.id } }),
    prisma.friendRequest.count({ where: { OR: [{ fromUserId: user.id }, { toUserId: user.id }], status: 'accepted' } }),
  ])

  return {
    postsCount,
    reactionsCount,
    friendsCount,
    user
  }
}