'use client';

import { ImageIcon, Loader, Send, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useState, useRef, ChangeEvent } from "react"
import { useUser } from "@/hooks/use-user";
import { MAX_IMAGE_SIZE } from "@/config/constants";
import { createPost } from "@/app/actions";
import { toast } from "sonner";

export const PostCreator = () => {
  const { user } = useUser()

  const [newPost, setNewPost] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [image, setImage] = useState<File | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleCreatePost = async () => {
    if (!user || !newPost.trim()) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("userId", user.id)
      formData.append("content", newPost.trim())

      if (image) {
        formData.append("image", image)
      }

      await createPost(formData)

      setNewPost("")
      setImage(null)
    } catch (error) {
      toast.error("Error al crear la publicación. Inténtalo de nuevo más tarde.")
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("La imagen es demasiado grande. Máximo 1MB.")
        setImage(null)
        return
      }

      setImage(file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
    } else {
      setImage(null)
    }
  }

  if (!user) {
    return null
  }

  return (
    <section className="mb-4 sm:mb-6">
      <div className="flex gap-2 sm:gap-3">
        <Avatar className="size-10 md:size-12 flex-shrink-0">
          <AvatarImage src={user?.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-purple-600 text-white text-xs sm:text-sm">
            {user?.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <Textarea
            placeholder="¿Qué está pasando?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className=" text-white placeholder-gray-400 resize-none text-sm sm:text-base"
            rows={3}
            maxLength={280}
          />
          {
            image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-auto object-fill rounded-sm mt-2"
              />
            )
          }
          <div className="flex items-center justify-between mt-2 sm:mt-3">
            <div className="flex items-center gap-2">
              {
                !image ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white p-1 sm:p-2"
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.click()
                      }
                    }}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-white p-1 sm:p-2"
                    onClick={() => {
                      setImage(null)
                      if (inputRef.current) {
                        inputRef.current.value = ""
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Eliminar imagen</span>
                  </Button>
                )
              }
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                ref={inputRef}
                onChange={handleImage}
                hidden
              />
              <span className="text-xs sm:text-sm text-gray-400">{newPost.length}/280</span>
            </div>
            <Button
              onClick={handleCreatePost}
              disabled={!newPost.trim() && !image}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm px-3 sm:px-4 text-white"
            >
              {
                isLoading ? (
                  <>
                    <Loader className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                    <span className="hidden md:inline">Enviando</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden md:inline">Publicar</span>
                    <span className="md:hidden">Post</span>
                  </>
                )
              }
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}