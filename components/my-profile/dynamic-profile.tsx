'use client';

import { useUser } from "@/hooks/use-user"

import { EditProfileButton } from "./edit-profile-button";
import { User } from "@/types/user";
import { ProfileAvatar } from "./profile-avatar";
import { BackgroundAvatar } from "./background-avatar";

export const DynamicProfile = ({
  user,
  postsCount,
  reactionsCount,
  friendsCount
}: {
  user: User;
  postsCount: number;
  reactionsCount: number;
  friendsCount: number;
}) => {
  const { user: oldUser } = useUser()

  return (
    <>
      <BackgroundAvatar user={user} />
      <article className="px-6 pt-4 pb-6">
        <header className="flex sm:flex-row flex-col max-sm:items-center gap-y-4">
          <ProfileAvatar user={user} />
          <div className="flex-1 ml-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{oldUser?.fullName || user.fullName}</h1>
            <p className="text-gray-400 text-sm"><strong>@{oldUser?.username || user.username}</strong>, {oldUser?.joinDate.toDateString() || user.joinDate.toDateString()}</p>
          </div>
          <EditProfileButton user={user} />
        </header>
        <main className="flex gap-x-6">
          <div className="flex-1">
            <h2
              className="text-xl font-semibold text-white mt-4 mb-1"
            >
              Sobre mí
            </h2>
            <p className="text-white leading-relaxed mb-4 max-w-md">
              {oldUser?.bio || user.bio || "No hay biografía disponible."}
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
    </>
  )
}