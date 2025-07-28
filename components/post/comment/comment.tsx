import { formatTimeAgo } from "@/utils/format-time";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

export const Comment = ({ comment }: {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      fullName: string;
      avatar: string | null;
    };
  }
}) => {
  return (
    <div className="flex gap-3 border-b  py-4">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
        <AvatarFallback className="bg-purple-600 text-white">
          {comment.user.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="font-medium text-white">{comment.user.fullName}</span>
            <span className="text-gray-400 text-sm ml-2">@{comment.user.username}</span>
          </div>
          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-gray-200">{comment.content}</p>
      </div>
    </div>
  )
}

export const CommentSkeleton = () => {
  return (
    <div className="flex gap-3 border-b py-4 animate-pulse">
      <Avatar className="w-10 h-10 flex-shrink-0 bg-gray-700">
        <AvatarFallback className="bg-gray-600 text-white">U</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="block w-24 h-4 bg-gray-600 rounded mb-1"></span>
            <span className="block w-16 h-3 bg-gray-500 rounded"></span>
          </div>
          <span className="block w-12 h-3 bg-gray-500 rounded"></span>
        </div>
        <p className="w-full h-4 bg-gray-600 rounded"></p>
      </div>
    </div>
  )
}