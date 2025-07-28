'use server';

import { PostReactionType, getPost } from "@/data/post";
import { getUserByEmail } from "@/data/user";
import { deleteImageFromCloudinary, sendImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { Post } from "@/types/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { MAX_IMAGE_SIZE } from "@/config/constants";

const ACCEPT_IMAGES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];

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

export const updateUser = async ({
  fullName,
  bio,
}: {
  fullName?: string;
  bio?: string;
}): Promise<object | null> => {

  try {
    const userClerk = await currentUser()

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const updatedUser = await prisma.user.update({
      where: { email: userClerk.emailAddresses[0]?.emailAddress },
      data: {
        fullName,
        bio,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export const updateUserAvatar = async ({
  avatar,
}: {
  userId: string;
  avatar: File | undefined;
}): Promise<string | null> => {
  if (avatar && !(avatar instanceof File)) {
    throw new Error("Avatar must be a valid file");
  }

  try {
    const userClerk = await currentUser()

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress)

    if (!user) {
      throw new Error("User not found");
    }

    let avatarUrl = null;
    let avatarPublicId = null;

    if (avatar) {
      // Validate the image type
      if (!ACCEPT_IMAGES.includes(avatar.type)) {
        throw new Error("Invalid image type. Supported types are: jpeg, png, gif, webp, jpg");
      }

      // Validate the image size
      if (avatar.size > MAX_IMAGE_SIZE) {
        throw new Error("Image size exceeds the maximum limit of 1MB");
      }

      // If the user already has an avatar, delete it from Cloudinary
      if (user.avatarPublicId) {
        await deleteImageFromCloudinary({ publicId: user.avatarPublicId });
      }

      const bufferImage = await avatar.arrayBuffer();
      const base64Image = Buffer.from(bufferImage).toString('base64');
      const cloudinaryResponse = await sendImageToCloudinary({ image: base64Image });

      if (cloudinaryResponse.secure_url) {
        avatarUrl = cloudinaryResponse.secure_url; // Store the URL of the uploaded image
        avatarPublicId = cloudinaryResponse.public_id; // Store the public ID for future reference
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatar: avatarUrl,
        avatarPublicId: avatarPublicId,
      },
    });

    return avatarUrl;
  } catch (error) {
    console.error("Error updating user avatar:", error);
    throw new Error("Failed to update user avatar");
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
export const createPost = async (formData: FormData): Promise<Post> => {
  const content = formData.get('content') as string;
  const image = formData.get('image') as File | undefined;

  if (!content) {
    throw new Error("Title and content are required");
  }

  const userClerk = await currentUser()

  if (!userClerk) {
    throw new Error("User not authenticated");
  }

  const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress);

  if (!user) {
    throw new Error("User not found");
  }

  const newPost: {
    userId: string;
    content: string;
    image?: string;
    imagePublicId?: string;
  } = {
    userId: user.id,
    content,
  }

  if (image && image instanceof File && image.size > 0) {
    // Validate the image type
    if (!ACCEPT_IMAGES.includes(image.type)) {
      throw new Error("Invalid image type. Supported types are: jpeg, png, gif, webp, jpg");
    }

    // Validate the image size
    if (image.size > MAX_IMAGE_SIZE) {
      throw new Error("Image size exceeds the maximum limit of 1MB");
    }

    const bufferImage = await image.arrayBuffer()
    const base64Image = Buffer.from(bufferImage).toString('base64')
    const cloudinaryResponse = await sendImageToCloudinary({ image: base64Image });

    if (cloudinaryResponse.secure_url) {
      newPost.image = cloudinaryResponse.secure_url; // Store the URL of the uploaded image
      newPost.imagePublicId = cloudinaryResponse.public_id; // Store the public ID for future reference
    }
  }

  try {
    const { id } = await prisma.post.create({
      data: newPost
    });

    const post = await getPost(id);

    revalidatePath('/')

    return {
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,
      commentsCount: 0,
      reactions: {
        'angry': { count: 0 },
        'haha': { count: 0 },
        'like': { count: 0 },
        'love': { count: 0 },
        'sad': { count: 0 },
        'wow': { count: 0 },
        'disgusted': { count: 0 },
      }
    };
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

    // If the post has an image, delete it from Cloudinary
    if (post.imagePublicId) {
      await deleteImageFromCloudinary({ publicId: post.imagePublicId });
    }

    // Finally, delete the post itself
    await prisma.post.update({
      where: { id: postId },
      data: { deleted: true },
    });

    revalidatePath('/');
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
  type,
}: {
  postId: string,
  type: PostReactionType
}): Promise<{
  id: string;
  postId: string;
  type: PostReactionType;
  createdAt: Date;
}> => {
  if (!postId || !type) {
    throw new Error("Post ID, and reaction type are required");
  }

  try {
    const userClerk = await currentUser()
    if (!userClerk) {
      throw new Error("User not authenticated");
    }
    const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress);
    if (!user) {
      throw new Error("User not found");
    }
    // Check if the user has already reacted to the post
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId,
        userId: user.id,
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
        userId: user.id,
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
  // userId,
}: {
  postId: string;
  userId: string;
}): Promise<void> => {
  if (!postId) {
    throw new Error("Post ID and User ID are required");
  }

  try {
    const userClerk = await currentUser()
    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress);

    if (!user) {
      throw new Error("User not found");
    }

    // Find the reaction to delete
    const reaction = await prisma.reaction.findFirst({
      where: {
        postId,
        userId: user.id,
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
  content,
}: {
  postId: string;
  content: string;
}): Promise<{
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}> => {
  const MAX_LENGTH = 200;

  if (!postId || !content) {
    throw new Error("Post ID, User ID, and content are required");
  }

  if (content.trim().length > MAX_LENGTH) {
    throw new Error(`Comment content exceeds the maximum length of ${MAX_LENGTH} characters`);
  }

  try {
    const userClerk = await currentUser()

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress);

    if (!user) {
      throw new Error("User not found");
    }

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        postId,
        content,
      },
    });

    revalidatePath(`/posts/${postId}`);

    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
}

export const createRequestFriend = async ({
  userId
}: {
  userId: string;
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const userClerk = await currentUser()

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is trying to send a friend request to themselves
    if (user.id === userId) {
      throw new Error("You cannot send a friend request to yourself");
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { fromUserId: user.id, toUserId: userId },
          { fromUserId: userId, toUserId: user.id },
        ],
        status: 'pending',
      },
    });

    if (existingRequest) {
      throw new Error("Friend request already sent");
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        fromUserId: user.id,
        toUserId: userId,
        status: 'pending',
      },
    });

    revalidatePath('/friends');
    revalidatePath(`/profile/${userId}`)

    return friendRequest;
  } catch (error) {
    console.error("Error creating friend request:", error);
    throw new Error("Failed to create friend request");
  }
}

export const acceptFriendRequest = async ({
  requestId
}: {
  requestId: string;
}) => {
  if (!requestId) {
    throw new Error("Request ID is required");
  }

  try {
    const userClerk = await currentUser()

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress);

    if (!user) {
      throw new Error("User not found");
    }

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest || friendRequest.toUserId !== user.id) {
      throw new Error("Friend request not found or you are not the recipient");
    }

    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });

    revalidatePath('/friends');
    revalidatePath(`/profile/${friendRequest.fromUserId}`)

    return updatedRequest;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw new Error("Failed to accept friend request");
  }
}

export const rejectFriendRequest = async ({
  requestId
}: {
  requestId: string;
}) => {
  if (!requestId) {
    throw new Error("Request ID is required");
  }

  try {
    const userClerk = await currentUser()

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress);

    if (!user) {
      throw new Error("User not found");
    }

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      throw new Error("Friend request not found or you are not the recipient");
    }

    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });

    revalidatePath('/friends');
    revalidatePath(`/profile/${friendRequest.fromUserId}`)

    return updatedRequest;
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    throw new Error("Failed to reject friend request");
  }
}

export const deleteFriend = async ({
  friendId
}: {
  friendId: string;
}) => {
  if (!friendId) {
    throw new Error("User ID is required");
  }

  try {
    const userClerk = await currentUser()

    if (!userClerk) {
      throw new Error("User not authenticated");
    }

    const user = await getUserByEmail(userClerk.emailAddresses[0]?.emailAddress);

    if (!user) {
      throw new Error("User not found");
    }

    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        id: friendId,
        status: 'accepted',
      },
    });

    if (!friendRequest) {
      throw new Error("No friendship found");
    }

    await prisma.friendRequest.delete({
      where: { id: friendRequest.id },
    });

    revalidatePath('/friends');
  } catch (error) {
    console.error("Error deleting friend:", error);
    throw new Error("Failed to delete friend");
  }
}