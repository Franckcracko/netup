import InfiniteScroll from "react-infinite-scroll-component";

import { Loader, MessageSquare } from "lucide-react";
import { Comment, CommentSkeleton } from "./comment";

export const CommentsContainer = ({
  isLoadingData,
  comments,
  hasNextPage,
  handleLoadMoreData,
  totalComments
}: {
  isLoadingData: boolean;
  hasNextPage: boolean;
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      fullName: string;
      avatar: string | null;
    };
  }[];
  totalComments: number;
  handleLoadMoreData: () => Promise<void>;
}) => {

  if (isLoadingData) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {
          Array.from({ length: 5 }).map((_, index) => (
            <CommentSkeleton key={`skeleton-${index}`} />
          ))
        }
      </div>
    )
  }

  if (!isLoadingData && comments.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-600 mb-2" />
        <h3 className="text-white font-medium">No hay mensajes</h3>
        <p className="text-gray-400 text-sm">Tus mensajes aparecerán aquí</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-custom">
      {/* <InfiniteScroll
        dataLength={comments.length}
        next={handleLoadMoreData}
        hasMore={totalComments > comments.length}
        loader={
          <div className="flex justify-center">
            <Loader
              className="w-6 h-6 text-purple-600 animate-spin"
              aria-label="Cargando mensajes"
            />
          </div>
        }
        endMessage={
          <p
            className="text-center text-gray-500 py-5"
            aria-label="No hay más mensajes"
          >No hay más mensajes</p>
        }
      > */}
        <div className="space-y-10 p-4">
          {
            comments.map((comment) => (<Comment key={`comment-${comment.id}`} comment={comment} />))
          }
        </div>
        {/* <div ref={messagesEndRef} /> */}
      {/* </InfiniteScroll> */}
    </div>
  )
}
