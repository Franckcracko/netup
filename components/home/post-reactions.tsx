'use client';

import { PostReactionType } from "@/data/post";
import { reactions } from "@/config/constants";

export const PostReactions = ({
  reactionsPost,
}: {
  reactionsPost: Record<PostReactionType, {
    count: number;
  }>
}) => {
  return (
    <div className="flex gap-1 items-center">
      <div className="flex items-center">
        {reactions
          .filter(({ name }) => reactionsPost[name].count > 0)
          .map(({ emoji }, index) => (
            <button
              key={crypto.randomUUID()}
              className={`z-[${index}] ${index > 0 ? '-ml-2' : ''} text-sm cursor-pointer transition-all duration-200 ease-in-out hover:scale-125`}
            >
              {emoji}
            </button>
          ))}
      </div>
      <span className="text-xs text-gray-300">
        {
          Object.values(reactionsPost).some((reaction) => reaction.count > 0) && (
            Object.values(reactionsPost).reduce(
              (acc, reaction) => acc + reaction.count,
              0
            )
          )
        }
      </span>
    </div>
  );
}
