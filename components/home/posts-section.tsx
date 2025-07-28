'use server';

import { getPostsFollowing } from "@/data/post";
import { Post } from "../post"
import LoadMore from "./load-more"

export const PostsSection = async () => {
  const { posts } = await getPostsFollowing({ page: 1 })

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
      <LoadMore />
    </>
  )
}