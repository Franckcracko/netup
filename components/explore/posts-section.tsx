'use server';

import { getPosts } from "@/data/post";
import { Post } from "../post"
import LoadMore from "./load-more";

export const PostsSection = async ({
  searchParams
}: {
  searchParams: Promise<{
    query?: string | undefined;
  }>
}) => {
  const { query } = await searchParams;

  const { posts } = await getPosts({ page: 1, query })

  return (
    <>
      <section className="space-y-4 mt-5">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
          />
        ))}
      </section>
      <LoadMore query={query} />
    </>
  )
}