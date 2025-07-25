import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Post } from "@/types/post";
import { Input } from "./ui/input";
import { createComment } from "@/app/actions";
import { useUser } from "@/hooks/use-user";
import { useEffect, useRef, useState } from "react";
import { CommentsContainer } from "./comments-container";

export const CommentsModal = ({
  post,
  isOpen,
  onClose
}: {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const user = useUser()
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState("")

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
        ...prev,
        {
          id: newComment.id,
          content: newComment.content,
          createdAt: newComment.createdAt,
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar || null,
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  p-4">
      <div
        ref={modalRef}
        className="bg-[#2d2d2d] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
        aria-modal="true"
        role="dialog"
        aria-labelledby="messages-title"
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 id="messages-title" className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Mensajes
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Contenido del modal */}
        <CommentsContainer
          comments={comments}
          handleChangeComments={(newComments) => setComments(newComments)}
          id={post.id}
        />

        {/* Footer con input para enviar mensajes */}
        <div className="p-4 border-t border-gray-700">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400"
            />
            <Button type="submit" disabled={!content.trim()} className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}