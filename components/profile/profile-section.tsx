'use client';

import { createRequestFriend, rejectFriendRequest } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card"
import { toast } from "sonner";
import { useState } from "react";

export const ProfileSection = ({
  user,
  isFriend,
  request,
  isMyProfile,
  isRequested,
  postsCount,
  friendsCount
}: {
  isMyProfile: boolean;
  request: {
    id: string;
    fromUserId: string;
    toUserId: string;
    status: string;
    createdAt: Date;
  } | null;
  isFriend: boolean;
  isRequested: boolean | null;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    avatar: string | null;
    avatarPublicId: string | null;
    bio: string | null;
    joinDate: Date;
    friendsCount: number;
    postsCount: number;
  };
  postsCount: number;
  reactionsCount: number;
  friendsCount: number;
}) => {

  const [isLoading, setIsLoading] = useState(false)
  return (
    <Card className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Avatar Section - Centrado en móvil */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 relative">
                <AvatarImage src={user.avatar || ""} />
                <AvatarFallback className="bg-purple-600 text-white text-xl sm:text-2xl">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <section className="flex-1 w-full text-center sm:text-left">
              <div>
                <div className="flex justify-between mb-3 sm:mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{user.fullName}</h2>
                    <p className="text-gray-400 text-sm sm:text-base">@{user.username}</p>
                  </div>
                  {
                    !isMyProfile && (
                      <>
                        {
                          isFriend ? (
                            <Button
                              className="bg-gray-600 hover:bg-gray-700 text-white"
                            >
                              <span className="text-xs sm:text-sm">Son amigos</span>
                            </Button>
                          ) : isRequested ? (
                            <Button
                              variant={'outline'}
                              className="text-red-400 "
                              onClick={async () => {
                                if (request) {
                                  try {
                                    setIsLoading(true);
                                    await rejectFriendRequest({ requestId: request.id });
                                    toast.success("Solicitud de amistad rechazada");
                                  } catch {
                                    toast.error("Error al rechazar la solicitud de amistad");
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }
                              }}
                            >
                              <span className="text-xs sm:text-sm">
                                {isLoading ? 'Cargando...' : request?.toUserId === user.id ? "Cancelar solicitud" : "Rechazar solicitud"}
                              </span>
                            </Button>
                          ) : (
                            <Button
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={async () => {
                                try {
                                  setIsLoading(true); await createRequestFriend({ userId: user.id })

                                  toast.success("Solicitud de amistad enviada");
                                } catch {
                                  toast.error("Error al enviar la solicitud de amistad");
                                } finally {
                                  setIsLoading(false);
                                }
                              }}
                            >
                              <span className="text-xs sm:text-sm">
                                {isLoading ? 'Cargando...' : 'Enviar solicitud de amistad'}
                              </span>
                            </Button>
                          )
                        }
                      </>
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

                  <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 pt-3 sm:pt-4">
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold text-white">{postsCount}</p>
                      <p className="text-xs sm:text-sm text-gray-400">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold text-white">{friendsCount}</p>
                      <p className="text-xs sm:text-sm text-gray-400">Amigos</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}