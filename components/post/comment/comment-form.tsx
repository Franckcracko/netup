'use client'
import { FormEvent, useState } from "react";
import { Button } from "../../ui/button";
import { Loader, Send } from "lucide-react";
import { createComment } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

export const CommentForm = ({
  postId
}: {
  postId: string
}) => {
  const { user } = useUser()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (content.trim() === '') return

    setIsLoading(true);
    try {
      await createComment({
        postId,
        content: content.trim()
      })
      setContent(""); // Clear the input after submission
    } catch (error) {
      toast.error("Error al crear el comentario. Inténtalo de nuevo más tarde.");
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mb-4 flex gap-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user?.avatar || ""} />
        <AvatarFallback className="bg-purple-600 text-white">
          {user?.username
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 flex-1 overflow-auto "
      >
        <div>
          <Textarea
            autoFocus
            required
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= 200) {
                setContent(e.target.value)
              }
            }}
            placeholder="Escribe un mensaje..."
            className="bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 max-h-[200px] scroll-custom"
          />
            <p className="text-gray-500 text-sm mt-1">
              {content.length}/200
            </p>
        </div>
        <div className="flex">
          <div className="flex-1">
          </div>
          <Button type="submit" disabled={!content.trim()} className="text-white bg-purple-600 hover:bg-purple-700">
            {
              isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar
                </>
              )
            }
          </Button>
        </div>
      </form>
    </section>
  )
}