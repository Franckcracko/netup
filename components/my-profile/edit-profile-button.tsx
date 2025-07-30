'use client'
import { Edit3, Loader, Save, X } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { useUser } from "@/hooks/use-user"
import { updateUser } from "@/app/actions"
import { toast } from "sonner"
import { User } from "@/types/user"

export const EditProfileButton = ({
  user
}: {
  user: User;
}) => {
  const { handleChangeUser } = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const [oldUser, setOldUser] = useState(user)

  const [isEditing, setIsEditing] = useState(false)

  const [editData, setEditData] = useState<{
    fullName: string
    bio: string
  }>({
    fullName: user.fullName,
    bio: user.bio || "",
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const updatedUser = {
        ...oldUser,
        fullName: editData.fullName,
        bio: editData.bio,
      }

      setOldUser(updatedUser)
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

    setEditData({
      fullName: oldUser.fullName,
      bio: oldUser.bio || "",
    })
    setIsEditing(false)
  }

  return (
    <Dialog
      open={isEditing}
      onOpenChange={(open) => {
        if (!open) {
          handleCancelEdit()
        } else {
          setIsEditing(true)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-purple-600 max-sm:w-full max-w-xs text-white hover:bg-purple-700">
          <Edit3
            className="w-4 h-4 mr-2"
          />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#2d2d2d]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSaveProfile()
          }}
        >
          <DialogHeader>
            <DialogTitle>Edita tu perfil</DialogTitle>
            <DialogDescription>
              Aquí puedes actualizar tu información personal, como tu nombre completo y biografía.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-white block mb-2">Nombre</label>
              <Input
                required
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                className="bg-[#1a1a1a] border-gray-600 text-white text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm text-white font-medium block mb-2">Email</label>
              <Input
                readOnly
                type="email"
                value={user.email}
                className="bg-[#1a1a1a] border-gray-600 text-white text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm text-white font-medium block mb-2">Biografía</label>
              <Textarea
                value={editData.bio || ""}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Cuéntanos sobre ti..."
                maxLength={160}
                className="bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-600 text-sm sm:text-base"
                rows={3}
              />
              <p className="text-xs text-white mt-1">{editData.bio.length}/160</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-400 hover:bg-gray-700 bg-transparent"
                onClick={handleCancelEdit}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </DialogClose>

            <Button
              size="sm"
              disabled={isLoading}
              className="bg-purple-600 text-white hover:bg-purple-700"
              type="submit"
            >
              {
                isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </>
                )
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}