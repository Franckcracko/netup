'use client';

import { getCommentsByPost } from "@/data/post"
import { useEffect, useState } from "react"
import { useUser } from "./use-user";
import { createComment } from "@/app/actions";

export const useComments = (postId: string) => {
  const { user } = useUser()

  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalComments, setTotalComments] = useState(0)
  const [isLoadingData, setIsLoadingData] = useState(false)

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  const [comments, setComments] = useState<{
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      fullName: string;
      avatar: string | null;
    };
  }[]>([])

  const handleLoadMoreData = async () => {
    const nextPage = currentPage + 1;
    console.log(nextPage)

    await fetchComments(nextPage);

    setCurrentPage(nextPage);
  }

  const handleSubmit = async (content: string) => {
    if (isLoadingSubmit) return

    if (!user) {
      return;
    }

    if (!content.trim()) {
      return; // Prevent empty comments
    }
    setIsLoadingSubmit(true);

    try {
      const newComment = await createComment({
        postId,
        content: content.trim(),
      })

      setComments((prev) => [
        {
          id: newComment.id,
          content: newComment.content,
          createdAt: new Date(),
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar || null,
          },
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsLoadingSubmit(false);
    }
  }

  const fetchComments = async (page: number) => {
    setIsLoadingData(true);

    try {
      const newComments = await getCommentsByPost({
        postId,
        page,
      });
      setHasNextPage(newComments.hasNext);
      setTotalComments(newComments.totalCount);
      setComments(prevState => [...prevState, ...newComments.comments]);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingData(false);
    }
  }

  useEffect(() => {
    let subscribed = true;

    (async () => {
      if (subscribed) {
        setIsLoadingData(true);

        try {
          const newComments = await getCommentsByPost({
            postId,
            page: 1,
          });

          setHasNextPage(newComments.hasNext);
          setTotalComments(newComments.totalCount);
          setComments(newComments.comments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        } finally {
          setIsLoadingData(false);
        }
      }
    })();

    return () => {
      subscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    comments,
    isLoadingData,
    isLoadingSubmit,
    hasNextPage,
    totalComments,
    handleLoadMoreData,
    handleChangeComments: setComments,
    handleSubmit,
  }
}