export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  reactions?: Reaction[];
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  status: "published" | "draft";
  tags?: string[];
  readTime?: number;
  comments?: Comment[]; // Make comments optional
}
