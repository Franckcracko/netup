'use client'
import { Camera, Edit3, Loader, Save, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useUser } from "@/hooks/use-user"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { MAX_IMAGE_SIZE } from "@/config/constants";

import { updateUser, updateUserAvatar } from "@/app/actions"
import { toast } from "sonner"

export const ProfileSection = ({
  postsCount,
  reactionsCount,
  friendsCount
}: {
  postsCount: number;
  reactionsCount: number;
  friendsCount: number;
}) => {
  const { user, handleChangeUser } = useUser()

  const inputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<File | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    fullName: string
    bio: string
  }>({
    fullName: "",
    bio: "",
  })

  const handleSaveProfile = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const updatedUser = {
        ...user,
        fullName: editData.fullName,
        bio: editData.bio,
      }

      handleChangeUser(updatedUser)

      await updateUser({
        bio: updatedUser.bio || undefined,
        fullName: updatedUser.fullName || undefined,
      })

      setIsLoading(false)

      setIsEditing(false)
    } catch (error) {
      toast.error("Error al actualizar el perfil. Inténtalo de nuevo más tarde.")
      console.log(error)
      setIsLoading(false)

      setEditData({
        fullName: user.fullName,
        bio: user.bio || "",
      })
    }
  }

  const handleCancelEdit = () => {
    if (isLoading) return

    if (!user) return

    setEditData({
      fullName: user.fullName,
      bio: user.bio || "",
    })
    setIsEditing(false)
  }

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!user) return

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
          ...user,
          avatar: secureUrl
        })
      } catch (error) {
        toast.error("Error al actualizar el avatar. Inténtalo de nuevo más tarde.")
        console.log(error)
      } finally {
        setIsLoadingImage(false)
        setImage(null)
      }
    } else {
      setImage(null)
    }
  }

  useEffect(() => {
    if (user) {
      setEditData({
        fullName: user.fullName,
        bio: user.bio || "",
      })
    }
  }, [user])

  if (!user) return null

  return (
    <Card className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Avatar Section - Centrado en móvil */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 relative">
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
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-white bg-purple-600 hover:bg-purple-700 p-0"
                onClick={() => inputRef.current?.click()}
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                ref={inputRef}
                onChange={handleImage}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full text-left">
              {!isEditing ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">{user.fullName}</h2>
                      <p className="text-gray-400 text-sm sm:text-base">@{user.username}</p>
                    </div>
                    {
                      user && (
                        <div >
                          <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Editar Perfil
                          </Button>
                        </div>
                      )
                    }
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Email</p>
                      <p className="text-white text-sm sm:text-base break-all">{user.email}</p>
                    </div>

                    {user.bio && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">Biografía</p>
                        <p className="text-white text-sm sm:text-base">{user.bio}</p>
                      </div>
                    )}

                    <div className="flex justify-between sm:justify-start gap-4 sm:gap-6 pt-3 sm:pt-4">
                      <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-white">{postsCount}</p>
                        <p className="text-xs sm:text-sm text-gray-400">Posts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-white">{friendsCount}</p>
                        <p className="text-xs sm:text-sm text-gray-400">Amigos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold text-white">{reactionsCount}</p>
                        <p className="text-xs sm:text-sm text-gray-400">Reacciones</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Editar Perfil</h2>
                    {/* Botones de edición - ocultos en móvil ya que están en el header */}
                    <div className="hidden sm:flex gap-2">
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-400 hover:bg-gray-700 bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        size="sm"
                        className="bg-purple-600 text-white hover:bg-purple-700"
                      >
                        {
                          isLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Guardar Cambios
                            </>
                          )
                        }
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400 block mb-2">Nombre Completo</label>
                      <Input
                        value={editData.fullName}
                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                        className="bg-[#1a1a1a] border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm text-gray-400 block mb-2">Email</label>
                      <Input
                        readOnly
                        type="email"
                        value={user.email}
                        className="bg-[#1a1a1a] border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm text-gray-400 block mb-2">Biografía</label>
                      <Textarea
                        value={editData.bio || ""}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        placeholder="Cuéntanos sobre ti..."
                        maxLength={160}
                        className="bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base"
                        rows={3}
                      />
                      <p className="text-xs text-gray-400 mt-1">{editData.bio.length}/160</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}