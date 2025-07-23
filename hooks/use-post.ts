'use client';

import { useEffect, useState } from "react";
import { getPosts } from "@/data/post"
import { createPost, reactToPost } from "@/app/actions";
import { Post } from "@/types/post";
import { deletePost } from "@/app/actions"

export const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [isLoading, setisLoading] = useState(false)

  const handleCreatePost = async ({ user, content }: {
    user: {
      id: string;
      username: string;
      avatar: string | null;
    } | null;
    content: string;
  }) => {
    if (!content.trim() || !user) return

    const formData = new FormData()

    formData.append('userId', user.id)
    formData.append('content', content)

    setisLoading(true)

    try {
      const newPost = await createPost(formData);

      setPosts(prevPosts => [newPost, ...prevPosts])
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setisLoading(false)
    }
  }

  const handleReaction = async (index: number, reaction: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry', userId: string) => {
    if (!posts[index]) return

    if (!userId) return

    const newPosts = [...posts]
    const post = newPosts[index]
    const existingReaction = post.reacted?.type

    if (existingReaction === reaction) {
      // If the user has already reacted with the same type, remove the reaction
      post.reacted = undefined;
      post.reactions[reaction].count -= 1;
    } else {
      // If the user is reacting with a different type or for the first time
      if (post.reacted) {
        // Remove the previous reaction count
        post.reactions[post.reacted.type].count -= 1;
      }
      post.reacted = { id: '', type: reaction }; // Placeholder ID, will be updated by the server

      post.reactions[reaction].count += 1;
    }

    setPosts(newPosts)

    await reactToPost({
      postId: post.id,
      type: reaction,
      userId,
    })
  }

  const handleChangeQuery = (query: string) => {
    setSearchQuery(query)
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId)

      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  useEffect(() => {
    const getPostsData = async () => {
      try {
        const postsData = await getPosts()
        setPosts(postsData)
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }

    getPostsData()
  }, [])

  return {
    handleChangeQuery,
    handleCreatePost,
    handleReaction,
    handleDeletePost,
    searchQuery,
    posts,
    isLoading
  }
}