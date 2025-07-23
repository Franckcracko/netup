'use server'

import { prisma } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { getUserByEmail } from './user';

export type PostReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

/** 
  * @function getPosts - Retrieves a paginated list of posts with optional search query.
  * @params query - Optional search query to filter posts by content or author username.
  * @params page - The page number for pagination, default is 1.
  * @params limit - The number of posts to return per page, default is 25.
  * @return {Promise<Array>} - Returns a promise that resolves to an array of posts.
  */
export const getPosts = async (query?: string, page = 1, limit = 25,): Promise<{
  id: string;
  content: string;
  image: string | null;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
  };
  reactions: Record<PostReactionType, { count: number }>
  reacted?: {
    id: string;
    type: PostReactionType;
  }
}[]> => {
  const offset = (page - 1) * limit;
  const userClerk = await currentUser()

  if (!userClerk) {
    throw new Error('User not authenticated');
  }

  const user = await getUserByEmail(userClerk.emailAddresses[0].emailAddress);

  if (!user) {
    throw new Error('User not found');
  }

  const posts = await prisma.post.findMany({
    skip: offset,
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
        }
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    },
    where: {
      OR: [
        {
          content: {
            contains: query,
            mode: 'insensitive',
          }
        },
        {
          author: {
            username: {
              contains: query,
              mode: 'insensitive',
            }
          }
        }
      ]
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return posts.map(post => {
    if (post.reactions.length === 0) {
      return {
        ...post,
        reactions: {
          'angry': { count: 0 },
          'haha': { count: 0 },
          'like': { count: 0 },
          'love': { count: 0 },
          'sad': { count: 0 },
          'wow': { count: 0 },
        } as Record<PostReactionType, { count: number }>,
      }
    }

    const reactedId = post.reactions.findIndex(reaction => reaction.user.id === user.id)

    const reactions = post.reactions.reduce((acc, reaction) => {
      const type = reaction.type as PostReactionType;
      if (!acc[type]) {
        acc[type] = { count: 0 };
      }
      acc[type].count += 1;
      return acc;
    }, {} as Record<PostReactionType, { count: number }>)

    return {
      ...post,
      userId: undefined,
      reacted: reactedId !== -1 ? {
        id: post.reactions[reactedId].id,
        type: post.reactions[reactedId].type,
      } : undefined,
      reactions,
    }
  })
}

export const getPost = async (id: string): Promise<{
  id: string;
  userId: string;
  content: string;
  image: string | null;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
  };
  reactions: Record<PostReactionType, { count: number }>
  reacted?: {
    id: string;
    type: PostReactionType;
  }
}> => {
  const post = await prisma.post.findUnique({
    where: {
      id
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
        }
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    },
  })

  if (!post) {
    throw new Error('Post not found');
  }

  const userClerk = await currentUser()

  if (!userClerk) {
    throw new Error('User not authenticated');
  }

  const user = await getUserByEmail(userClerk.emailAddresses[0].emailAddress);
  
  if (!user) {
    throw new Error('User not found');
  }

  const reactedId = post.reactions.findIndex(reaction => reaction.user.id === user.id)

  const reactions = post.reactions.reduce((acc, reaction) => {
    const type = reaction.type as PostReactionType;
    if (!acc[type]) {
      acc[type] = { type, count: 0 };
    }
    acc[type].count += 1;
    return acc;
  }, {} as Record<PostReactionType, { type: PostReactionType; count: number }>)

  return {
    ...post,
    reacted: reactedId !== -1 ? {
      id: post.reactions[reactedId].id,
      type: post.reactions[reactedId].type,
    } : undefined,
    reactions,
  }
}