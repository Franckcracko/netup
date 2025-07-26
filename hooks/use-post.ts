'use client';

import { useCallback, useEffect, useState } from "react";
import { getPosts } from "@/data/post"
import { createPost, reactToPost } from "@/app/actions";
import { Post } from "@/types/post";
import { deletePost } from "@/app/actions"
import { debounce } from "@/utils/debounce";

export const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const [isLoading, setisLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const handleCreatePost = async ({ user, content, image }: {
    user: {
      id: string;
      username: string;
      avatar: string | null;
    } | null;
    content: string;
    image?: File | null;
  }) => {
    if (!content.trim() || !user) return

    const formData = new FormData()

    formData.append('userId', user.id)
    formData.append('content', content)

    if (image) {
      formData.append('image', image)
    }

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchDebounce = useCallback(
    debounce(async (query: string) => {
      setIsLoadingData(true)
      try {
        const postsData = await getPosts({ page: 1, query })
        setPosts(postsData.posts)
        setHasNextPage(postsData.hasNext)
        setCurrentPage(1)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoadingData(false)
      }
    }, 300),
    []
  )

  const handleChangeQuery = async (query: string) => {
    setSearchQuery(query)

    if (query.trim() !== '') {
      handleSearchDebounce(query)
    } else {
      await fetchPosts(1)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))

      await deletePost(postId)
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const fetchPosts = async (page: number) => {
    try {
      const postsData = await getPosts({ page })
      setPosts(prevState => [...prevState, ...postsData.posts])
      setHasNextPage(postsData.hasNext)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleLoadMoreData = async () => {
    const newPage = currentPage + 1;
    await fetchPosts(newPage);
    setCurrentPage(newPage);
  };

  useEffect(() => {
    let subscribed = true;

    (async () => {
      if (subscribed) {
        try {
          const postsData = await getPosts({ page:1 })
          setPosts(postsData.posts)
          setHasNextPage(postsData.hasNext)
        } catch (error) {
          console.error("Error fetching posts:", error)
        } finally {
          setIsLoadingData(false)
        }
      }
    })();

    return () => {
      subscribed = false;
    };
  }, [])

  return {
    handleChangeQuery,
    handleCreatePost,
    handleReaction,
    handleDeletePost,
    fetchPosts,
    handleLoadMoreData,
    hasNextPage,
    searchQuery,
    posts,
    isLoading,
    isLoadingData
  }
}