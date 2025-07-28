'use server'

import { prisma } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server';
import { getUserByEmail } from './user';
import { Prisma } from '@prisma/client';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar: string | null;
  avatarPublicId: string | null;
  bio: string | null;
  joinDate: Date;
  friendsCount: number;
  postsCount: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  fromUser: User;
  toUser: User;
  mutualFriends: number;
}

export interface Friend {
  id: string;
  createdAt: Date;
  user: User;
  mutualFriends: number;
}

export const getFriends = async ({
  query,
  page = 1,
  limit = 5,
}: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{
  friends: Friend[];
  hasNext: boolean;
}> => {
  const offset = (page - 1) * limit;
  const userClerk = await currentUser()

  if (!userClerk) {
    throw new Error('User not authenticated');
  }

  const user = await getUserByEmail(userClerk.emailAddresses[0].emailAddress);

  if (!user) {
    throw new Error('User not found');
  }

  const where: Prisma.FriendRequestWhereInput = {
    AND: [
      {
        OR: [
          { fromUserId: user.id },
          { toUserId: user.id }
        ]
      },
      {
        OR: [
          {
            fromUser: {
              username: { contains: query, mode: 'insensitive' },
              id: { not: user.id }
            },
          },
          {
            toUser: {
              username: { contains: query, mode: 'insensitive' },
              id: { not: user.id }
            },
          },
        ]
      }
    ],
    status: 'accepted'
  };

  const friends = await prisma.friendRequest.findMany({
    where,
    include: {
      fromUser: true,
      toUser: true,
    },
    skip: offset,
    take: limit,
  })

  const totalFriends = await prisma.friendRequest.count({ where });

  const friendsWithMutualCount = await Promise.all(
    friends.map(async (friend) => {
      const mutualFriendsCount = await prisma.friendRequest.count({
        where: {
          status: 'accepted',
          OR: [
            { fromUserId: friend.fromUserId, toUserId: friend.toUserId },
            { fromUserId: friend.toUserId, toUserId: friend.fromUserId },
          ],
        },
      });

      const userFriend = friend.fromUserId === user.id ? friend.toUser : friend.fromUser;

      return {
        id: friend.id,
        user: userFriend,
        mutualFriends: mutualFriendsCount - 1, // Exclude the two users themselves
        createdAt: friend.createdAt,
      };
    })
  );

  return {
    friends: friendsWithMutualCount,
    hasNext: totalFriends > (page * limit),
  }
}

export const getFriendsRequest = async ({
  page = 1,
  limit = 5,
}: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{
  friends: FriendRequest[];
  hasNext: boolean;
}> => {
  const offset = (page - 1) * limit;
  const userClerk = await currentUser()

  if (!userClerk) {
    throw new Error('User not authenticated');
  }

  const user = await getUserByEmail(userClerk.emailAddresses[0].emailAddress);

  if (!user) {
    throw new Error('User not found');
  }

  const where: Prisma.FriendRequestWhereInput = {
    toUserId: user.id,
    status: 'pending',
  };

  const friends = await prisma.friendRequest.findMany({
    where,
    include: {
      fromUser: true,
      toUser: true,
    },
    skip: offset,
    take: limit,
  })

  const totalFriends = await prisma.friendRequest.count({ where });

  const friendsWithMutualCount = await Promise.all(
    friends.map(async (friend) => {
      const mutualFriendsCount = await prisma.friendRequest.count({
        where: {
          status: 'accepted',
          OR: [
            { fromUserId: friend.fromUserId, toUserId: friend.toUserId },
            { fromUserId: friend.toUserId, toUserId: friend.fromUserId },
          ],
        },
      });

      return {
        ...friend,
        mutualFriends: mutualFriendsCount - 1, // Exclude the two users themselves
      };
    })
  );

  return {
    friends: friendsWithMutualCount,
    hasNext: totalFriends > (page * limit),
  }
}