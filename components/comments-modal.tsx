import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Post } from "@/types/post";
import { Input } from "./ui/input";
import { MessagesIcon } from "./icons/messages";
import { Textarea } from "./ui/textarea";
import { createComment } from "@/app/actions";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { getCommentsByPost } from "@/data/post";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatTimeAgo } from "@/utils/format-time";

export const CommentsModal = ({
  post,
}: {
  post: Post;
}) => {
  const [comments, setComments] = useState<{
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      avatar: string | null;
    };
  }[]>([])
  const user = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [content, setContent] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return

    if (!user) {
      return;
    }

    if (!content.trim()) {
      return; // Prevent empty comments
    }
    setIsLoading(true);
    try {
      const newComment = await createComment({
        postId: post.id,
        userId: user.id, // Assuming the author is the user commenting
        content: content.trim(),
      })

      setContent("");

      setComments((prev) => [
        {
          id: newComment.id,
          content: newComment.content,
          createdAt: newComment.createdAt,
          user: {
            id: user.id,
            username: user.username,
            avatar: user.avatar || null,
          },
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const getComments = async () => {
      setIsLoadingData(true);
      try {
        const commentsData = await getCommentsByPost(post.id);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
          <MessageCircle className="w-4 h-4 mr-1" />
          {post.commentsCount}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#2d2d2d] border-gray-700">
        <DialogHeader>
          <DialogTitle>Comentarios</DialogTitle>
        </DialogHeader>
        {
          isLoadingData ? (
            <div className="w-full flex flex-col justify-center items-center py-10">
              <MessagesIcon className="size-32 animate-spin" />
              <span className="text-white/80 text-sm">Cargando comentarios...</span>
            </div>
          ) : (
            <div className="my-6 space-y-6">
              {
                comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 ">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author.avatar || ""} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {post.author.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm text-gray-300">
                          <strong>{comment.user.username}</strong> · {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                        <p className="text-white">{comment.content}</p>
                      </div>
                      <div className="text-gray-500 text-xs ml-2">
                        {formatTimeAgo(comment.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex flex-col justify-center items-center ">
                    <MessagesIcon className="size-32" />
                    <span className="text-white/80 text-sm">
                      No hay comentarios aún. Sé el primero en comentar.
                    </span>
                  </div>
                )
              }
            </div>
          )
        }

        <form onSubmit={handleSubmit}>
          <div className="w-full space-y-2 max-md:hidden">
            <Textarea
              maxLength={280}
              placeholder="Escribe un comentario..." id="message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              {
                isLoading ? "Enviando..." : "Enviar comentario"
              }
            </Button>
          </div>
          <div className="flex justify-between items-center gap-x-2 md:hidden">
            <Input
              id="message"
              placeholder="Escribe un comentario..."
              className="w-full "
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
              {
                isLoading ? "Enviando..." : "Enviar"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}