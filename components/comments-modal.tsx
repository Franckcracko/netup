import { MessageSquare, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Post } from "@/types/post";
import { Input } from "./ui/input";
import { useState } from "react";
import { CommentsContainer } from "./comments-container";
import { useComments } from "@/hooks/use-comments";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export const CommentsModal = ({
  post,
  isOpen,
  onChangeOpen
}: {
  post: Post;
  isOpen: boolean;
  onChangeOpen: (value: boolean) => void;
}) => {
  const {
    comments,
    isLoadingData,
    hasNextPage,
    handleLoadMoreData,
    handleSubmit,
    totalComments
  } = useComments(post.id);

  const [content, setContent] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onChangeOpen}>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Mensajes
          </DialogTitle>
        </DialogHeader>

        {/* Contenido del modal */}
        <CommentsContainer
          comments={comments}
          isLoadingData={isLoadingData}
          totalComments={totalComments}
          handleLoadMoreData={handleLoadMoreData}
          hasNextPage={hasNextPage}
        />

        {/* Footer con input para enviar mensajes */}
        <div className="p-4 border-t border-gray-700">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (content.trim()) {
                await handleSubmit(content.trim());
                setContent("");
              }
            }}
            className="flex gap-2"
          >
            <Input
              autoFocus
              // ref={inputRef}
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
      </DialogContent>
    </Dialog>
  )
}