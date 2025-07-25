import { getCommentsByPost } from "@/data/post";
import { useEffect, useRef, useState } from "react";
import { Comment, CommentSkeleton } from "./comment";
import { MessageSquare } from "lucide-react";

export const CommentsContainer = ({
  id,
  comments,
  handleChangeComments
}: {
  id: string;
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
  handleChangeComments: (comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      fullName: string;
      avatar: string | null;
    };
  }[]) => void
}) => {
  const [isLoadingData, setIsLoadingData] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getComments = async () => {
      setIsLoadingData(true);
      try {
        const commentsData = await getCommentsByPost(id);
        handleChangeComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isLoadingData && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [comments, isLoadingData])

  if (isLoadingData) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {
          Array.from({ length: 5 }).map((_, index) => (
            <CommentSkeleton key={`skeleton-${index}`} />
          ))
        }
      </div>
    )
  }

  if (!isLoadingData && comments.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-600 mb-2" />
        <h3 className="text-white font-medium">No hay mensajes</h3>
        <p className="text-gray-400 text-sm">Tus mensajes aparecerán aquí</p>
      </div>
    )
  }
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {
        comments.map((comment) => (<Comment key={`comment-${comment.id}`} comment={comment} />))
      }
      <div ref={messagesEndRef} />
    </div>
  )
}
