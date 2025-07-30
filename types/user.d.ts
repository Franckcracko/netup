export interface User {
  postsCount: number;
  friendsCount: number;
  fullName: string;
  bio: string | null;
  id: string;
  email: string;
  username: string;
  backgroundImage: string | null;
  backgroundImagePublicId: string | null;
  avatar: string | null;
  avatarPublicId: string | null;
  joinDate: Date;
}