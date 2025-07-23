import { PostReactionType } from "@/data/post"

export const reactions = [
  {
    name: "like",
    emoji: "👍",
  },
  {
    name: "love",
    emoji: "❤️",
  },
  {
    name: "haha",
    emoji: "😂",
  },
  {
    name: "wow",
    emoji: "😮",
  },
  {
    name: "sad",
    emoji: "😢",
  },
  {
    name: "angry",
    emoji: "😡"
  }
] as {
  name: PostReactionType;
  emoji: string;
}[]