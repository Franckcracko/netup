'use client';

import { Loader } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { toast } from "sonner"
import { updateUserAvatar } from "@/app/actions"
import { ChangeEvent, useRef, useState } from "react"
import { useUser } from "@/hooks/use-user"
import { MAX_IMAGE_SIZE } from "@/config/constants"
import { User } from "@/types/user"

export const ProfileAvatar = ({
  user
}: {
  user: User
}) => {
  const { user: oldUser, handleChangeUser } = useUser()

  const inputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<File | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!oldUser) {
      toast.error("No user data available.")
      return
    }

    const file = event.target.files?.[0]

    if (file) {
      setIsLoadingImage(true)
      setImage(file)
      const reader = new FileReader()
      reader.readAsDataURL(file)

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("El archivo es demasiado grande. El tamaño máximo es 1MB.")
        setIsLoadingImage(false)
        setImage(null)
        return
      }

      try {
        const secureUrl = await updateUserAvatar({
          userId: user.id,
          avatar: file
        })

        handleChangeUser({
          ...oldUser,
          avatar: secureUrl
        })
      } catch (error) {
        toast.error("Error al actualizar el avatar. Inténtalo de nuevo más tarde.")
        console.log(error)
      } finally {
        setImage(null)
        setIsLoadingImage(false)
      }
    } else {
      setImage(null)
    }
  }

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="size-36 sm:size-40 relative -mt-20"
      >
        <Avatar className="size-full border-8 border-[#2d2d2d]">
          {
            isLoadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/70 rounded-full">
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
            )
          }
          <AvatarImage src={!image ? user.avatar || "" : URL.createObjectURL(image)} />
          <AvatarFallback className="bg-purple-600 text-white text-xl sm:text-2xl">
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </button>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        ref={inputRef}
        onChange={handleImage}
        className="hidden"
      />
    </>
  )
}