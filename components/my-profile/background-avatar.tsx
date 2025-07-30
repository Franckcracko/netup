import { updateBackgroundImage } from "@/app/actions"
import { MAX_IMAGE_SIZE } from "@/config/constants"
import { useUser } from "@/hooks/use-user"
import { User } from "@/types/user"
import { ChangeEvent, useRef, useState } from "react"
import { toast } from "sonner"

export const BackgroundAvatar = ({
  user
}: {
  user: User
}) => {
  const { user: oldUser, handleChangeUser } = useUser()

  const inputRef = useRef<HTMLInputElement>(null)

  const [isLoadingImage, setIsLoadingImage] = useState(false)

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!oldUser) {
      toast.error("No user data available.")
      return
    }

    const file = event.target.files?.[0]

    if (!file) {
      toast.error("No file selected.")
      return
    }

    setIsLoadingImage(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)

    if (file.size > MAX_IMAGE_SIZE * 2) {
      toast.error("El archivo es demasiado grande. El tamaño máximo es 2MB.")
      setIsLoadingImage(false)
      return
    }

    try {
      const secureUrl = await updateBackgroundImage({
        userId: user.id,
        backgroundImage: file
      })

      handleChangeUser({
        ...oldUser,
        backgroundImage: secureUrl
      })
    } catch (error) {
      toast.error("Error al actualizar el avatar. Inténtalo de nuevo más tarde.")
      console.log(error)
    } finally {
      setIsLoadingImage(false)
    }
  }

  return (
    <>
      <button
        className="w-full h-48"
        onClick={() => inputRef.current?.click()}
      >
        {
          isLoadingImage ? (
            <div className="w-full h-full bg-gray-700 animate-pulse" />
          ) : user.backgroundImage ? (
            <img src={user.backgroundImage} alt="background-profile" className="w-full object-cover h-full" />
          ) : (
            <div className="w-full h-48 bg-gray-700 animate-pulse" />
          )
        }
      </button>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        ref={inputRef}
        onChange={handleImage}
        className="hidden"
      />
      <input type="text" />
    </>
  )
}