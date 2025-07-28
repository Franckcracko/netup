'use client';

import { getCommentsByPost } from "@/data/post";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Comment } from "./comment";
import { Loader } from "lucide-react";

let page = 2;
let hasNext = true;

export const LoadMore = ({ postId }: { postId: string }) => {
  const { ref, inView } = useInView();

  const [data, setData] = useState<{
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      fullName: string;
      avatar: string | null;
    };
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inView && hasNext) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await getCommentsByPost({ page, postId });
          hasNext = response.hasNext;
          page++;
          setData(response.comments);
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false);
        }
      }
      fetchData();
    }
  }, [inView, data, isLoading, postId]);

  useEffect(() => {
    return () => {
      page = 2;
      hasNext = true;
    }
  }, [])

  return (
    <>
      <section className="space-y-5 pb-6">
        {data.map((item) => (
          <Comment
            key={item.id}
            comment={item}
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