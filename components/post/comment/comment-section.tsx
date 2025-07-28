import { getCommentsByPost } from "@/data/post";
import { Comment, CommentSkeleton } from "./comment";
import { CommentForm } from "./comment-form";
import { LoadMore } from "./load-more";

export const CommentSection = async ({
  postId,
}: {
  postId: string;
}) => {
  const { comments } = await getCommentsByPost({
    postId,
    page: 1,
  })

  return (
    <section>
      <h2 className="my-4 text-2xl font-bold text-white">Comentarios</h2>
      <CommentForm postId={postId} />
      {
        comments.length === 0 && (
          <p className="text-gray-500 text-center my-6">No hay comentarios aún. Sé el primero en comentar.</p>
        )
      }
      <section className="space-y-5 py-6">
        {
          comments.map((comment) => (<Comment key={`comment-${comment.id}`} comment={comment} />))
        }
      </section>
      <LoadMore postId={postId} />
    </section>
  );
}

export const CommentSectionSkeleton = () => {
  return (
    <section>
      <h2 className="my-4 text-2xl font-bold text-white">Comentarios</h2>
      <div className="space-y-5 py-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <CommentSkeleton key={`comment-skeleton-${index}`} />
        ))}
      </div>
    </section>
  );
}