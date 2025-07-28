'use client';

import { FriendRequest } from "@/data/friends";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { acceptFriendRequest, rejectFriendRequest } from "@/app/actions";
import { formatTimeAgo } from "@/utils/format-time";

export const Request = ({
  request,
  onDelete
}: {
  request: FriendRequest;
  onDelete?: (requestId: string) => void;
}) => {
  return (
    <div className="p-4 flex items-center justify-between">
      <Link href={`/profile/${request.fromUserId}`} className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={request.fromUser.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-purple-600 text-white">
            {request.fromUser.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-white">{request.fromUser.fullName}</h3>
          <p className="text-sm text-gray-400">@{request.fromUser.username}</p>
          <p className="text-xs text-gray-500">{formatTimeAgo(request.createdAt)}</p>
        </div>
      </Link>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => { acceptFriendRequest({ requestId: request.id }) }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="w-4 h-4 mr-2" />
          Aceptar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-600 text-white"
          onClick={async () => {
            await rejectFriendRequest({ requestId: request.id });
            if (onDelete) {
              onDelete(request.id);
            }
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Rechazar
        </Button>
      </div>
    </div>
  )
}