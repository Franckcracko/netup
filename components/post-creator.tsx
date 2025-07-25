'use client';

import { ImageIcon, Loader, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { useState, useRef, ChangeEvent } from "react"

export const PostCreator = ({
  user,
  isLoading,
  handleCreatePost
}: {
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    avatar: string | null;
    bio: string | null;
    joinDate: Date;
    friendsCount: number;
    postsCount: number;
  };
  isLoading: boolean;
  handleCreatePost: ({ user, content }: {
    user: {
      id: string;
      username: string;
      avatar: string | null;
    } | null;
    content: string;
    image?: File | null;
  }) => Promise<void>
}) => {
  const [newPost, setNewPost] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      setIsLoadingImage(true)
      reader.onloadend = () => {
        setIsLoadingImage(false)
      }
      reader.readAsDataURL(file)
    } else {
      setImage(null)
    }
  }

  return (
    <Card className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6">
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
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
              className="bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 resize-none text-sm sm:text-base"
              rows={3}
              maxLength={280}
            />
            <div className="flex items-center justify-between mt-2 sm:mt-3">
              <div className="flex items-center gap-2">
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
                  {
                    isLoadingImage ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="size-10 object-fill rounded-sm"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )
                  }
                </Button>
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
                onClick={async () => {
                  if (isLoading) return

                  if (!user) return

                  await handleCreatePost({
                    content: newPost,
                    user,
                    image: image
                  })

                  setImage(null)
                  setNewPost("")
                }}
                disabled={!newPost.trim()}
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
      </CardContent>
    </Card>
  )
}