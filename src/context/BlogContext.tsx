import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  reactions?: Reaction[];
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string | null;
  author?: Author;
  status: "published" | "draft";
  tags?: string[];
  readTime?: number;
  createdAt?: string;
  updatedAt?: string;
  comments: Comment[];
}

interface BlogContextProps {
  blogs: Blog[];
  addBlog: (blog: Partial<Blog>) => void;
  updateBlog: (id: string, blog: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  getBlogById: (id: string) => Blog | undefined;
  fetchBlogs: () => Promise<void>;
}

const BlogContext = createContext<BlogContextProps | undefined>(undefined);

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogContext must be used within a BlogProvider");
  }
  return context;
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Load blogs from localStorage on component mount
  useEffect(() => {
    const storedBlogs = localStorage.getItem("blogs");
    if (storedBlogs) {
      try {
        setBlogs(JSON.parse(storedBlogs));
      } catch (error) {
        console.error("Failed to parse stored blogs:", error);
        // Initialize with empty array if parsing fails
        setBlogs([]);
      }
    }
  }, []);

  // Save blogs to localStorage whenever blogs state changes
  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }, [blogs]);

  const addBlog = (blogData: Partial<Blog>) => {
    const newBlog: Blog = {
      id: `blog-${Date.now()}`,
      title: blogData.title || "",
      content: blogData.content || "",
      excerpt: blogData.excerpt,
      coverImage: blogData.coverImage,
      author: blogData.author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: blogData.status || "draft",
      tags: blogData.tags || [],
      readTime: blogData.readTime || 1,
      comments: blogData.comments || [], // Ensure comments is initialized
    };

    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    return newBlog;
  };

  const updateBlog = (id: string, updatedFields: Partial<Blog>) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === id
          ? {
              ...blog,
              ...updatedFields,
              updatedAt: new Date().toISOString(),
            }
          : blog
      )
    );
  };

  const deleteBlog = (id: string) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
  };

  const getBlogById = (id: string) => {
    return blogs.find((blog) => blog.id === id);
  };

  const fetchBlogs = async (): Promise<void> => {
    // This function would normally fetch blogs from an API
    // For now, it's just a placeholder that resolves immediately
    // as we're using localStorage for storage
    return Promise.resolve();
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        getBlogById,
        fetchBlogs,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
