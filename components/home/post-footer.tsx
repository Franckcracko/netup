'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MessageCircle, ThumbsUp } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { PostReactions } from "./post-reactions"
import Link from "next/link"
import { SharedButton } from "./shared-button"
import { Post } from "@/types/post"
import { reactions } from "@/config/constants"
import { Badge } from "../ui/badge"
import { useState } from "react";
import { reactToPost } from "@/app/actions";
import { PostReactionType } from "@/data/post";
import { toast } from "sonner";

const getColor = (reaction: PostReactionType) => {
  switch (reaction) {
    case 'like':
      return 'text-blue-500 hover:text-blue-600';
    case 'love':
      return 'text-pink-500 hover:text-pink-600';
    case 'haha':
      return 'text-yellow-500 hover:text-yellow-600';
    case 'wow':
      return 'text-orange-500 hover:text-orange-600';
    case 'sad':
      return 'text-blue-500 hover:text-blue-600';
    case 'angry':
      return 'text-red-500 hover:text-red-600';
    case 'disgusted':
      return 'text-green-500 hover:text-green-600';
    default:
      return 'text-gray-400 hover:text-gray-400';
  }
}

const getTextReaction = (reaction: PostReactionType) => {
  switch (reaction) {
    case 'like':
      return 'Me gusta';
    case 'love':
      return 'Me encanta';
    case 'haha':
      return 'Me da risa';
    case 'wow':
      return 'Me sorprende';
    case 'sad':
      return 'Me entristece';
    case 'angry':
      return 'Me enoja';
    case 'disgusted':
      return 'Me disgusta';
    default:
      return 'Reaccionar';
  }
}

export const PostFooter = ({
  post
}: {
  post: Post
}) => {
  const [reactionsPost, setReactionsPost] = useState(post.reactions)
  const [reacted, setReacted] = useState(post.reacted);
  const [openReactions, setOpenReactions] = useState(false)

  return (
    <footer className="mt-6">
      <PostReactions reactionsPost={reactionsPost} />
      <Separator className="mt-2" />
      <div className="pt-2 flex items-center justify-between">
        <Popover
          open={openReactions}
          onOpenChange={(open) => setOpenReactions(open)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer ${reacted ? getColor(reacted.type) : 'text-gray-400 hover:text-gray-400'}`}
            >
              {reacted ? getTextReaction(reacted.type) : (
                <>
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span className="max-sm:hidden">
                    Reaccionar
                  </span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex items-center justify-between">
              {reactions.map(({ name, emoji }) => (
                <Badge
                  key={`badge-${name}-${post.id}`}
                  variant="secondary"
                  className={`transition-all duration-200 ease-in-out hover:scale-125 cursor-pointer text-gray-300  ${reacted?.type === name ? 'bg-blue-500 hover:bg-blue-400' : 'hover:bg-gray-700 bg-transparent'}`}
                  asChild
                >
                  <button
                    onClick={async () => {
                      try {
                        if (reacted?.type === name) {
                          // If the user has already reacted with the same type, remove the reaction
                          setReacted(undefined);
                          setReactionsPost(prev => ({
                            ...prev,
                            [name]: {
                              count: prev[name].count - 1
                            }
                          }))
                        } else {
                          // If the user is reacting with a different type or for the first time
                          if (reacted) {
                            // Remove the previous reaction count
                            setReactionsPost(prev => ({
                              ...prev,
                              [reacted.type]: {
                                count: prev[reacted.type].count - 1
                              }
                            }))
                          }

                          setReacted({ id: '', type: name }); // Placeholder ID, will be updated by the server

                          setReactionsPost(prev => ({
                            ...prev,
                            [name]: {
                              count: prev[name].count + 1
                            }
                          }))
                        }
                        setOpenReactions(false)

                        await reactToPost({
                          postId: post.id,
                          type: name,
                        })
                      } catch (error) {
                        toast.error("Error al reaccionar al post. Inténtalo de nuevo más tarde.");
                        console.log(error);
                      }
                    }}
                  >
                    {emoji}
                  </button>
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Link href={`/posts/${post.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer text-gray-400 hover:text-gray-400"
          >
            <MessageCircle className="w-4 h-4 mr-1 -rotate-90" />
            <span className="max-sm:hidden">
              Comentar
            </span>
          </Button>
        </Link>
        <SharedButton post={post} />
      </div>
    </footer >
  )
}
