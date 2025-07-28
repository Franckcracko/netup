"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

import { Loader } from "lucide-react";
import { Friend, getFriends } from "@/data/friends";
import { FriendItem } from "./friend-item";

let page = 2;
let hasNext = true;

export function LoadMoreFriends({
  query
}: {
  query?: string;
}) {
  const { ref, inView } = useInView();

  const [data, setData] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inView && hasNext) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await getFriends({ page, query })

          setData(data.friends);
          hasNext = data.hasNext
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
      <div className="grid gap-4">
        {data.map((friend) => (
          <FriendItem
            key={friend.id}
            friend={friend}
            onDelete={() => {
              setData((prev) => prev.filter((f) => f.id !== friend.id));
            }}
          />
        ))}
      </div>
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
