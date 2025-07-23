import { type PostReactionType } from "@/data/post";

export interface Post {
  id: string;
  content: string;
  image: string | null;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
  };
  reactions: Record<PostReactionType, { count: number }>
  reacted?: {
    id: string;
    type: PostReactionType;
  }
}