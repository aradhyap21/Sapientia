
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium?: boolean;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: User;
  publishedAt: string;
  readTime: string;
  likes: number;
  comments: Comment[];
  saved?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  reactions?: Reaction[];
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted?: boolean;
}
