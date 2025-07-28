'use server'
import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server';

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export const getUser = async (id: string) => {
  const userClerk = await currentUser()

  if (!userClerk) {
    throw new Error('User not authenticated');
  }

  const user = await getUserByEmail(userClerk.emailAddresses[0].emailAddress);

  if (!user) {
    throw new Error('User not found');
  }

  const userFind = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  const friend = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { fromUserId: user.id },
        { toUserId: user.id },
      ],
      status: { in: ['accepted', 'pending'] },
    },
  })
  
  return {
    user: userFind,
    isMyProfile: user.id === id,
    isFriend: friend?.status === 'accepted',
    isRequested: friend && friend.status === 'pending',
    request: friend
  }
}

export const getUserStats = async (email: string) => {
  const user = await getUserByEmail(email)
  if (!user) return null

  const [postsCount, reactionsCount, friendsCount] = await Promise.all([
    prisma.post.count({ where: { userId: user.id, deleted: false } }),
    prisma.reaction.count({ where: { userId: user.id, post: { deleted: false } } }),
    prisma.friendRequest.count({ where: { OR: [{ fromUserId: user.id }, { toUserId: user.id }], status: 'accepted' } }),
  ])

  return {
    postsCount,
    reactionsCount,
    friendsCount,
    user
  }
}