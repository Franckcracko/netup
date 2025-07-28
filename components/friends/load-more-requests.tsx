"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

import { Loader } from "lucide-react";
import { Request } from "./requests";
import { FriendRequest, getFriendsRequest } from "@/data/friends";

let page = 2;
let hasNext = true;

export function LoadMoreRequests() {
  const { ref, inView } = useInView();

  const [data, setData] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inView && hasNext) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await getFriendsRequest({ page })

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

  }, [inView, data, isLoading]);

  useEffect(() => {
    return () => {
      page = 2;
      hasNext = true;
    }
  }, []);

  return (
    <>
      <div className="divide-y divide-gray-700">
        {data.map((request) => (
          <Request
            key={request.id}
            request={request}
            onDelete={(requestId) => {
              setData((prev) => prev.filter((r) => r.id !== requestId));
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
