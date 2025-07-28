'use server';

import { FriendItem } from "@/components/friends/friend-item";
import { LoadMoreFriends } from "@/components/friends/load-more-friends";
import { LoadMoreRequests } from "@/components/friends/load-more-requests";
import { Request } from "@/components/friends/requests";
import { Searcher } from "@/components/friends/searcher";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFriends, getFriendsRequest } from "@/data/friends";
import { Clock, Users } from "lucide-react"

export default async function Friends({
  searchParams
}: {
  searchParams: Promise<{ query?: string; }>
}) {
  const { query } = await searchParams;

  const { friends: friendRequests } = await getFriendsRequest({ page: 1 })
  const { friends } = await getFriends({ page: 1, query })

  return (
    <main className="max-w-6xl px-4 py-6 2xl:mx-auto">
      <div className="mb-6">
        <Searcher query={query} />
      </div>

      <Card className="bg-[#2d2d2d] border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Solicitudes de Amistad
            <Badge variant="secondary" className="bg-purple-600 text-white">
              {friendRequests.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {
            friendRequests.length <= 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Sin solicitudes de amistad
                </h3>
              </div>
            )
          }
          <div className="divide-y divide-gray-700">
            {friendRequests.map((request) => (
              <Request key={request.id} request={request} />
            ))}
          </div>
          <LoadMoreRequests />
        </CardContent>
      </Card>

      <section>
        <h2
          className="text-2xl font-bold text-white mb-4 flex items-center gap-2"
        >
          Amigos
        </h2>
        {friends.length <= 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {query ? "No se encontraron amigos" : "No tienes amigos aún"}
            </h3>
          </div>
        )}
        <div className="grid gap-4">
          {friends.map((friend) => (
            <FriendItem key={friend.id} friend={friend} />
          ))}
        </div>
        <LoadMoreFriends query={query} />
      </section>
    </main>
  )
}
