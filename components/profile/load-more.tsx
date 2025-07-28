"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

import { getPosts } from "@/data/post";
import { type Post } from "@/types/post";
import { Post as PostItem } from "../post";
import { Loader } from "lucide-react";

let page = 2;
let hasNext = true;

function LoadMore({
  query
}: {
  query: string
}) {
  const { ref, inView } = useInView();

  const [data, setData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inView && hasNext) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await getPosts({ page, query });
          setData(response.posts);
          hasNext = response.hasNext
          page++;
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false);
        }
      }

      fetchData();
    }

  }, [inView, data, isLoading, query]);

  useEffect(() => {
    return () => {
      page = 2;
      hasNext = true;
    }
  }, []);

  return (
    <>
      <section className="space-y-4 mt-4">
        {data.map((item) => (
          <PostItem
            key={item.id}
            onDelete={() => {
              setData((prev) => prev.filter((post) => post.id !== item.id));
            }}
            post={item}
          />
        ))}
      </section>
      <section className="flex justify-center items-center w-full">
        <div ref={ref}>
          {inView && isLoading && (
            <Loader
              className="animate-spin text-purple-600 mt-5"
              width={56}
              height={56}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default LoadMore;