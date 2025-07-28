'use server'

import { prisma } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { getUserByEmail } from './user';
import { Prisma } from '@prisma/client';

interface Post {
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
  commentsCount: number;
}

export type PostReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | 'disgusted';

/** 
  * @function getPosts - Retrieves a paginated list of posts with optional search query.
  * @params query - Optional search query to filter posts by content or author username.
  * @params page - The page number for pagination, default is 1.
  * @params limit - The number of posts to return per page, default is 25.
  * @return {Promise<Array>} - Returns a promise that resolves to an array of posts.
  */
export const getPosts = async ({
  query,
  page = 1,
  limit = 5,
}: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{
  posts: Post[];
  totalCount: number;
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

  const orQueries: Prisma.PostWhereInput[] =
    [
      {
        content: {
          contains: query || '',
          mode: 'insensitive',
        }
      },
    ]

  if (query?.charAt(0) === '@' && query.length > 1) {
    orQueries.push({
      author: {
        username: {
          equals: `${query}`.slice(1).trim(),
          mode: 'insensitive',
        }
      }
    })
  }

  const where: Prisma.PostWhereInput = {
    OR: orQueries,
    deleted: false,
    type: 'post',
  }

  const posts = await prisma.post.findMany({
    skip: offset,
    take: limit,
    include: {
      _count: {
        select: {
          comments: true,
        }
      },
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
    where,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const totalCount = await prisma.post.count({ where })

  const postsWithReactions = posts.map(post => {
    if (post.reactions.length === 0) {
      return {
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        author: post.author,
        commentsCount: post._count.comments,
        reactions: {
          'angry': { count: 0 },
          'haha': { count: 0 },
          'like': { count: 0 },
          'love': { count: 0 },
          'sad': { count: 0 },
          'wow': { count: 0 },
          disgusted: { count: 0 },
        } as Record<PostReactionType, { count: number }>,
      }
    }

    const reactedId = post.reactions.findIndex(reaction => reaction.user.id === user.id)

    const reactions = {
      'angry': { count: 0 },
      'haha': { count: 0 },
      'like': { count: 0 },
      'love': { count: 0 },
      'sad': { count: 0 },
      'wow': { count: 0 },
      disgusted: { count: 0 },
    }

    post.reactions.forEach(reaction => {
      const type = reaction.type as PostReactionType;
      if (reactions[type]) {
        reactions[type].count += 1;
      }
    })

    // If the user has reacted to the post, we include their reaction type
    const reacted = reactedId !== -1 ? {
      id: post.reactions[reactedId].id,
      type: post.reactions[reactedId].type,
    } : undefined

    return {
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,
      reacted,
      reactions,
      commentsCount: post._count.comments,
    }
  })

  return {
    posts: postsWithReactions,
    totalCount,
    hasNext: totalCount > (page * limit),
  }
}

export const getPostsByUser = async ({
  userId,
  page = 1,
  limit = 5,
}: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<{
  posts: Post[];
  totalCount: number;
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

  if (!userId) {
    throw new Error('User ID is required');
  }

  const where: Prisma.PostWhereInput = {
    userId,
    deleted: false,
    type: 'post',
  }

  const posts = await prisma.post.findMany({
    skip: offset,
    take: limit,
    include: {
      _count: {
        select: {
          comments: true,
        }
      },
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
    where,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const totalCount = await prisma.post.count({ where })

  const postsWithReactions = posts.map(post => {
    if (post.reactions.length === 0) {
      return {
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        author: post.author,
        commentsCount: post._count.comments,
        reactions: {
          'angry': { count: 0 },
          'haha': { count: 0 },
          'like': { count: 0 },
          'love': { count: 0 },
          'sad': { count: 0 },
          'wow': { count: 0 },
          'disgusted': { count: 0 },
        } as Record<PostReactionType, { count: number }>,
      }
    }

    const reactedId = post.reactions.findIndex(reaction => reaction.user.id === user.id)

    const reactions = {
      'angry': { count: 0 },
      'haha': { count: 0 },
      'like': { count: 0 },
      'love': { count: 0 },
      'sad': { count: 0 },
      'wow': { count: 0 },
      'disgusted': { count: 0 },
    }

    post.reactions.forEach(reaction => {
      const type = reaction.type as PostReactionType;
      if (reactions[type]) {
        reactions[type].count += 1;
      }
    })

    // If the user has reacted to the post, we include their reaction type
    const reacted = reactedId !== -1 ? {
      id: post.reactions[reactedId].id,
      type: post.reactions[reactedId].type,
    } : undefined

    return {
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,
      reacted,
      reactions,
      commentsCount: post._count.comments,
    }
  })

  return {
    posts: postsWithReactions,
    totalCount,
    hasNext: totalCount > (page * limit),
  }
}

export const getPostsFollowing = async ({
  page = 1,
  limit = 5,
}: {
  page?: number;
  limit?: number;
}): Promise<{
  posts: Post[];
  totalCount: number;
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

  const where: Prisma.PostWhereInput = {
    deleted: false,
    type: 'post',
    author: {
      OR: [
        {
          sentRequests: {
            some: {
              OR: [
                { fromUserId: user.id },
                { toUserId: user.id }
              ],
              status: 'accepted'
            }
          }
        },
        {
          receivedRequests: {
            some: {
              OR: [
                { fromUserId: user.id },
                { toUserId: user.id }
              ],
              status: 'accepted'
            }
          }
        },
        {
          id: user.id,
        },
      ]
    },
  }

  const posts = await prisma.post.findMany({
    skip: offset,
    take: limit,
    include: {
      _count: {
        select: {
          comments: true,
        }
      },
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
    where,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const totalCount = await prisma.post.count({ where })

  const postsWithReactions = posts.map(post => {
    if (post.reactions.length === 0) {
      return {
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        author: post.author,
        commentsCount: post._count.comments,
        reactions: {
          'angry': { count: 0 },
          'haha': { count: 0 },
          'like': { count: 0 },
          'love': { count: 0 },
          'sad': { count: 0 },
          'wow': { count: 0 },
          'disgusted': { count: 0 },
        } as Record<PostReactionType, { count: number }>,
      }
    }

    const reactedId = post.reactions.findIndex(reaction => reaction.user.id === user.id)

    const reactions = {
      'angry': { count: 0 },
      'haha': { count: 0 },
      'like': { count: 0 },
      'love': { count: 0 },
      'sad': { count: 0 },
      'wow': { count: 0 },
      'disgusted': { count: 0 },
    }

    post.reactions.forEach(reaction => {
      const type = reaction.type as PostReactionType;
      if (reactions[type]) {
        reactions[type].count += 1;
      }
    })

    // If the user has reacted to the post, we include their reaction type
    const reacted = reactedId !== -1 ? {
      id: post.reactions[reactedId].id,
      type: post.reactions[reactedId].type,
    } : undefined

    return {
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,
      reacted,
      reactions,
      commentsCount: post._count.comments,
    }
  })

  return {
    posts: postsWithReactions,
    totalCount,
    hasNext: totalCount > (page * limit),
  }
}

export const getPost = async (id: string): Promise<Post> => {
  const post = await prisma.post.findUnique({
    where: {
      id,
      deleted: false
    },
    include: {
      _count: {
        select: {
          comments: true,
        }
      },
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

  if (post.reactions.length === 0) {
    return {
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,
      commentsCount: post._count.comments,
      reactions: {
        'angry': { count: 0 },
        'haha': { count: 0 },
        'like': { count: 0 },
        'love': { count: 0 },
        'sad': { count: 0 },
        'wow': { count: 0 },
        'disgusted': { count: 0 },
      } as Record<PostReactionType, { count: number }>,
    }
  }

  const reactedId = post.reactions.findIndex(reaction => reaction.user.id === user.id)

  const reactions = {
    'angry': { count: 0 },
    'haha': { count: 0 },
    'like': { count: 0 },
    'love': { count: 0 },
    'sad': { count: 0 },
    'wow': { count: 0 },
    'disgusted': { count: 0 },
  }

  post.reactions.forEach(reaction => {
    const type = reaction.type as PostReactionType;
    if (reactions[type]) {
      reactions[type].count += 1;
    }
  })

  // If the user has reacted to the post, we include their reaction type
  const reacted = reactedId !== -1 ? {
    id: post.reactions[reactedId].id,
    type: post.reactions[reactedId].type,
  } : undefined

  return {
    id: post.id,
    content: post.content,
    image: post.image,
    createdAt: post.createdAt,
    author: post.author,
    reacted,
    reactions,
    commentsCount: post._count.comments,
  }
}

export const getCommentsByPost = async ({
  postId,
  page = 1,
  limit = 5
}: {
  postId: string;
  page?: number;
  limit?: number;
}): Promise<{
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      fullName: string;
      avatar: string | null;
    };
  }[];
  totalCount: number;
  hasNext: boolean;
}> => {
  const offset = (page - 1) * limit;

  const where = {
    postId,
  }

  const comments = await prisma.comment.findMany({
    where,
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true
    }
  })

  const totalCount = await prisma.comment.count({ where })

  const newComments = comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    user: {
      id: comment.author.id,
      username: comment.author.username,
      fullName: comment.author.fullName,
      avatar: comment.author.avatar,
    }
  }))

  return {
    comments: newComments,
    totalCount,
    hasNext: totalCount > (page * limit),
  }
}

export const getRecentAnnouncements = async ({
  query,
  page = 1,
  limit = 5,
}: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{
  posts: Post[];
  totalCount: number;
  hasNext: boolean;
}> => {
  const offset = (page - 1) * limit;

  const where: Prisma.PostWhereInput = {
    type: 'announcement',
    deleted: false,
    content: {
      contains: query || '',
      mode: 'insensitive',
    },
  };

  const announcements = await prisma.post.findMany({
    skip: offset,
    take: limit,
    include: {
      _count: {
        select: {
          comments: true,
        }
      },
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
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalCount = await prisma.post.count({ where });

  const posts = announcements.map(post => {
    if (post.reactions.length === 0) {
      return {
        id: post.id,
        content: post.content,
        image: post.image,
        createdAt: post.createdAt,
        author: post.author,
        commentsCount: post._count.comments,
        reactions: {
          'angry': { count: 0 },
          'haha': { count: 0 },
          'like': { count: 0 },
          'love': { count: 0 },
          'sad': { count: 0 },
          'wow': { count: 0 },
          'disgusted': { count: 0 },
        } as Record<PostReactionType, { count: number }>,
      }
    }

    const reactions = {
      'angry': { count: 0 },
      'haha': { count: 0 },
      'like': { count: 0 },
      'love': { count: 0 },
      'sad': { count: 0 },
      'wow': { count: 0 },
      'disgusted': { count: 0 },
    }

    post.reactions.forEach(reaction => {
      const type = reaction.type as PostReactionType;
      if (reactions[type]) {
        reactions[type].count += 1;
      }
    })

    return {
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,
      reacted: undefined,
      reactions,
      commentsCount: post._count.comments,
    }
  })

  return {
    posts,
    totalCount,
    hasNext: totalCount > (page * limit),
  };
}