'use server';

import { getPosts } from "@/data/post";
import { Post } from "../post"
import LoadMore from "./load-more";


export const PostsSection = async ({ username }: {
  username: string;
}) => {
  const query = `@${username}`

  const { posts } = await getPosts({ query, page: 1 })

  return (
    <>
      <section className="space-y-4 mt-5">
        <h2 className="text-2xl font-bold text-white mb-4">Mis Posts</h2>
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