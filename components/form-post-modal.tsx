import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PostCreator } from "./home/post-creator";

export const FormPostModal = ({
  isOpen,
  onChangeOpen
}: {
  isOpen: boolean;
  onChangeOpen: (open: boolean) => void;
}) => {

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onChangeOpen}
    >
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Crear publicación</DialogTitle>
          <DialogDescription>
            Comparte tus pensamientos, imágenes o enlaces con la comunidad.
          </DialogDescription>
        </DialogHeader>
        <PostCreator />
      </DialogContent>
    </Dialog>
  )
}