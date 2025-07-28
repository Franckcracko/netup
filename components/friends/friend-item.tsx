'use client';

import { Friend } from "@/data/friends"
import { Card, CardContent } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import Link from "next/link"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"
import { deleteFriend } from "@/app/actions";
import { toast } from "sonner";

export const FriendItem = ({
  friend,
  onDelete
}: {
  friend: Friend;
  onDelete?: (friendId: string) => void;
}) => {
  const [showDelete, setShowDelete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card key={friend.id} className="bg-[#2d2d2d] border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={friend.user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-purple-600 text-white">
                {friend.user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{friend.user.fullName}</h3>
              <p className="text-sm text-gray-400">@{friend.user.username}</p>
              {friend.user.bio && <p className="text-sm text-gray-500 mt-1">{friend.user.bio}</p>}
              {friend.mutualFriends > 0 && (
                <p className="text-xs text-purple-400 mt-1">{friend.mutualFriends} amigos en común</p>
              )}
            </div>
          </div>
          <div className="flex gap-x-2">
            <Button
              onClick={() => setShowDelete(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>

            <Link href={`/profile/${friend.user.id}`}>
              <Button variant={'link'}>
                Ver perfil
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
      <Dialog
        open={showDelete}
        onOpenChange={(open) => setShowDelete(open)}
      >
        <DialogContent className="bg-[#2d2d2d] border-gray-700">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);

              try {
                await deleteFriend({ friendId: friend.id });
                if (onDelete) {
                  onDelete(friend.id);
                }
              } catch (error) {
                toast.error("Error al eliminar el amigo. Inténtalo de nuevo más tarde.");
                console.log(error);
              } finally {
                setIsLoading(false);
              }
              setShowDelete(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>
                ¿Estás seguro de que quieres cortar tu amistad con @{friend.user.username}?
              </DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. El post será eliminado permanentemente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">
                {isLoading ? "Eliminando..." : "Eliminar Amigo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>

      </Dialog>
    </Card>
  )
}