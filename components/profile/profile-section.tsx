'use client';

import { createRequestFriend, rejectFriendRequest } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { User } from "@/types/user";

export const ProfileSection = ({
  user,
  isFriend,
  request,
  isMyProfile,
  isRequested,
  postsCount,
  friendsCount,
  reactionsCount
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
  user: User;
  postsCount: number;
  reactionsCount: number;
  friendsCount: number;
}) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <section className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6 rounded-lg overflow-hidden">
      {
        user.backgroundImage ? (
          <img src={user.backgroundImage} alt="background-profile" className="w-full object-cover h-48" />
        ) : (
          <div className="w-full h-48 bg-gray-700 animate-pulse" />
        )
      }
      <article className="px-6 pt-4 pb-6">
        <header className="flex sm:flex-row flex-col max-sm:items-center gap-y-4">
          <Avatar className="size-36 sm:size-40 relative -mt-20 border-8 border-[#2d2d2d]">
            <AvatarImage src={user.avatar || ""} />
            <AvatarFallback className="bg-purple-600 text-white text-xl sm:text-2xl">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 ml-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{user.fullName || user.fullName}</h1>
            <p className="text-gray-400 text-sm"><strong>@{user.username || user.username}</strong>, {user.joinDate.toDateString() || user.joinDate.toDateString()}</p>
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
                        {isLoading ? 'Cargando...' : 'Enviar solicitud'}
                      </span>
                    </Button>
                  )
                }
              </>
            )
          }
        </header>
        <main className="flex gap-x-6">
          <div className="flex-1">
            <h2
              className="text-xl font-semibold text-white mt-4 mb-1"
            >
              Sobre mí
            </h2>
            <p className="text-white leading-relaxed mb-4 max-w-md">
              {user?.bio || user.bio || "No hay biografía disponible."}
            </p>
          </div>
        </main>
        <footer className="flex flex-wrap gap-y-2 gap-x-4 text-gray-200 text-sm mt-4">
          <p>
            Publicaciones {" "}<strong className="ml-1 text-white">{postsCount}</strong>
          </p>
          <p>
            Reacciones {" "}<strong className="ml-1 text-white">{reactionsCount}</strong>
          </p>
          <p>
            Amigos {" "}<strong className="ml-1 text-white">{friendsCount}</strong>
          </p>
        </footer>
      </article>
    </section>
  )
}