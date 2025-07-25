'use server';

import { PostReactionType, getPost } from "@/data/post";
import { sendImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Create a new user
 * @function
 * @param {Object} user - The user object containing email, fullName, and username.
 * @param {string} user.email - The email of the user to retrieve.
 * @param {string} user.fullName - The name of the user to retrieve.
 * @param {string} user.username - The username of the user to retrieve.
 * @return {Promise<object|null>} - Returns the user object if found, null otherwise.
 */
export const createUser = async ({
  email,
  fullName,
  username,
}: {
  email: string;
  fullName: string;
  username: string;
}): Promise<object | null> => {
  if (!email || !fullName || !username) {
    throw new Error("All fields are required");
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        username,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

/**
 * Check if the username exists
 * @function
 * @param {string} username - The username to check for availability.
 * @return {Promise<boolean>} - Returns true if the username is available, false otherwise.
 */
export const verifyUsername = async (username: string): Promise<boolean> => {
  if (!username) {
    throw new Error("Username is required");
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    return !existingUser; // Returns true if username is available
  } catch (error) {
    console.error("Error checking username:", error);
    throw new Error("Failed to verify username");
  }
}

/**
 * Create a post
 * @function
 * @param {FormData} formData - This will contain userId, content, and image (opt).
 * @param {string} formData.get('userId') - The ID of the user creating the post.
 * @param {string} formData.get('content') - The content of the post.
 * @param {File | undefined} formData.get('image') - The image file for the post (optional).
 */
export const createPost = async (formData: FormData) => {
  const userId = formData.get('userId') as string;
  const content = formData.get('content') as string;
  const image = formData.get('image') as File | undefined;

  if (!userId || !content) {
    throw new Error("Title and content are required");
  }

  const newPost: {
    userId: string;
    content: string;
    image?: string;
  } = {
    userId,
    content,
  }

  if (image) {
    const bufferImage = await image.arrayBuffer()
    const base64Image = Buffer.from(bufferImage).toString('base64')
    const cloudinaryResponse = await sendImageToCloudinary({ image: base64Image });

    if (cloudinaryResponse.secure_url) {
      newPost.image = cloudinaryResponse.secure_url; // Store the URL of the uploaded image
    }
  }

  try {
    const { id } = await prisma.post.create({
      data: newPost
    });

    const post = await getPost(id);

    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export const deletePost = async (postId: string): Promise<void> => {
  if (!postId) {
    throw new Error("Post ID is required");
  }

  try {
    const userClerk = await currentUser()

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true }
    })

    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the user is the author of the post
    if (post.author.email !== userClerk.emailAddresses[0]?.emailAddress) {
      throw new Error("You are not authorized to delete this post");
    }

    // Finally, delete the post itself
    await prisma.post.update({
      where: { id: postId },
      data: { deleted: true },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}

/**
 * React to a post
 * @function
 * @param {Object} reaction - The parameters for reacting to a post.
 * @param {string} reaction.postId - The ID of the post to react to.
 * @param {string} reaction.userId - The ID of the user reacting to the post.
 * @param {'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'} reaction.type - The type of reaction.
 * @return {Promise<object>} - Returns the reaction object.
 */
export const reactToPost = async ({
  postId,
  userId,
  type,
}: {
  postId: string,
  userId: string,
  type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
}): Promise<{
  id: string;
  userId: string;
  postId: string;
  type: PostReactionType;
  createdAt: Date;
}> => {
  if (!postId || !userId || !type) {
    throw new Error("Post ID, User ID, and reaction type are required");
  }

  try {
    // Check if the user has already reacted to the post
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingReaction) {
      // If the user has already reacted, and the reaction type is the same, do nothing
      if (existingReaction.type === type) {
        return await prisma.reaction.delete({
          where: { id: existingReaction.id },
        });
      }

      // If the user has already reacted, update the reaction type
      return await prisma.reaction.update({
        where: {
          id: existingReaction.id,
        },
        data: {
          type,
        },
      });
    }

    const reaction = await prisma.reaction.create({
      data: {
        postId,
        userId,
        type,
      },
    });

    return reaction;
  } catch (error) {
    console.error("Error reacting to post:", error);
    throw new Error("Failed to react to post");
  }
}

/**
 * Delete a reaction from a post
 * @function
 * @param {Object} params - The parameters for deleting a reaction.
 * @param {string} params.postId - The ID of the post from which to delete the reaction.
 * @param {string} params.userId - The ID of the user whose reaction is being deleted.
 * @return {Promise<void>} - Returns nothing if successful, throws an error otherwise.
 */
export const deleteReactPost = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}): Promise<void> => {
  if (!postId || !userId) {
    throw new Error("Post ID and User ID are required");
  }

  try {
    // Find the reaction to delete
    const reaction = await prisma.reaction.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (!reaction) {
      throw new Error("Reaction not found");
    }

    await prisma.reaction.delete({
      where: { id: reaction.id },
    });
  } catch (error) {
    console.error("Error deleting reaction:", error);
    throw new Error("Failed to delete reaction");
  }
}

export const createComment = async ({
  postId,
  userId,
  content,
}: {
  postId: string;
  userId: string;
  content: string;
}): Promise<{
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}> => {
  if (!postId || !userId || !content) {
    throw new Error("Post ID, User ID, and content are required");
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
    });

    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
}