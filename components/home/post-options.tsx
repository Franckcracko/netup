'use client';

import { AlertCircle, MoreHorizontal, Pencil, Share2, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { deletePost } from "@/app/actions";

export const PostOptions = ({
  postId,
  onDelete
}: {
  postId: string;
  onDelete?: (postId: string) => void;
}) => {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-32 bg-[#2d2d2d] border-[#212121]">
          {
            true ? (
              <>
                <DropdownMenuItem>
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDelete(true)}>
                  <Trash className="w-4 h-4 mr-1" />
                  Borrar
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem disabled>
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Reportar
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Share2 className="w-4 h-4 mr-1" />
                  Compartir
                </DropdownMenuItem>
              </>
            )
          }
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={showDelete}
        onOpenChange={(open) => setShowDelete(open)}
      >
        <DialogContent className="bg-[#2d2d2d] border-gray-700">
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                await deletePost(postId);

                if (onDelete) {
                  onDelete(postId);
                }
              } catch (error) {
                console.error("Error al eliminar el post:", error);
              }
              setShowDelete(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>
                ¿Estás seguro de que quieres eliminar este post?
              </DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. El post será eliminado permanentemente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" >Cancelar</Button>
              </DialogClose>
              <Button type="submit">Aceptar</Button>
            </DialogFooter>
          </form>
        </DialogContent>

      </Dialog>

    </>
  )
}