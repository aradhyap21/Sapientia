// Core imports
import { useState } from "react";
import { Link } from "react-router-dom";

// UI components
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Icons
import { Calendar, Heart, MessageSquare, Clock, Bookmark } from "lucide-react";

// Hooks and utilities
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

// Types
interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  readTime: string;
  likes: number;
  comments: number;
}

// Mock data - in a real app, this would come from an API
const latestContent: Post[] = [
  {
    id: 1,
    title: "Understanding Quantum Computing Basics",
    author: "Dr. Maria Chen",
    date: "2023-11-15",
    excerpt: "An introduction to the fundamental principles of quantum computing and its potential applications.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    readTime: "8 min read",
    likes: 87,
    comments: 14
  },
  {
    id: 2,
    title: "Climate Change: Recent Developments",
    author: "Prof. James Wilson",
    date: "2023-11-14",
    excerpt: "A comprehensive overview of the latest research and global policy changes related to climate change.",
    imageUrl: "https://www.noaa.gov/sites/default/files/styles/landscape_width_1275/public/2022-03/PHOTO-Climate-Collage-Diagonal-Design-NOAA-Communications-NO-NOAA-Logo.jpg",
    readTime: "12 min read",
    likes: 65,
    comments: 8
  },
  {
    id: 3,
    title: "Advancements in Artificial Intelligence",
    author: "Sarah Johnson",
    date: "2023-11-13",
    excerpt: "Exploring recent breakthroughs in AI research and their implications for various industries.",
    imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    readTime: "10 min read",
    likes: 92,
    comments: 17
  },
  {
    id: 4,
    title: "The Future of Renewable Energy",
    author: "Dr. Michael Brown",
    date: "2023-11-12",
    excerpt: "Examining emerging trends and technologies in renewable energy and sustainable development.",
    imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    readTime: "7 min read",
    likes: 73,
    comments: 11
  },
  {
    id: 5,
    title: "Modern Approaches to Mental Health",
    author: "Dr. Emily Parker",
    date: "2023-11-11",
    excerpt: "New research and therapeutic methods for addressing common mental health challenges.",
    imageUrl: "https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    readTime: "9 min read",
    likes: 58,
    comments: 9
  },
  {
    id: 6,
    title: "Blockchain Beyond Cryptocurrency",
    author: "Alex Thompson",
    date: "2023-11-10",
    excerpt: "Exploring innovative applications of blockchain technology outside the realm of digital currencies.",
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    readTime: "11 min read",
    likes: 81,
    comments: 12
  }
];

const PostCard = ({ post, liked, onLike, bookmarked, onBookmark }: { 
  post: Post; 
  liked: boolean; 
  onLike: () => void;
  bookmarked: boolean;
  onBookmark: () => void;
}) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow relative">
      <button
        onClick={onBookmark}
        className="absolute top-2 right-2 z-10 p-1.5 bg-background/80 rounded-full hover:bg-background"
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-colors",
            bookmarked
              ? "fill-primary text-primary"
              : "text-muted-foreground"
          )}
        />
      </button>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
          <Link to={`/blog/${post.id}`} className="block h-full">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </Link>
        </div>
        <div className="md:w-2/3 flex flex-col justify-between p-4">
          <div>
            <div className="flex flex-wrap justify-between items-center mb-3">
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="h-3 w-3 mr-1" />
                {post.readTime}
              </div>
            </div>
            <Link to={`/blog/${post.id}`}>
              <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              <span className="mx-2">•</span>
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onLike} 
                className="flex items-center space-x-1 group"
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 transition-colors", 
                    liked 
                      ? "fill-primary text-primary" 
                      : "text-muted-foreground group-hover:text-primary"
                  )} 
                />
                <span className={cn(
                  "text-sm", 
                  liked ? "text-primary" : "text-muted-foreground"
                )}>
                  {post.likes}
                </span>
              </button>
              <Link to={`/blog/${post.id}#comments`} className="flex items-center space-x-1 text-muted-foreground hover:text-primary">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{post.comments}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function Latest() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<number, boolean>>({});
  const [posts, setPosts] = useState<Post[]>(latestContent);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleLike = (postId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like articles",
        variant: "destructive",
      });
      return;
    }

    setLikedPosts(prev => {
      const wasLiked = prev[postId];
      return { ...prev, [postId]: !wasLiked };
    });

    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const increment = likedPosts[postId] ? -1 : 1;
          return { ...post, likes: post.likes + increment };
        }
        return post;
      })
    );
  };

  const handleBookmark = (postId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark articles",
        variant: "destructive",
      });
      return;
    }

    setBookmarkedPosts(prev => {
      const wasBookmarked = prev[postId];
      return { ...prev, [postId]: !wasBookmarked };
    });
    
    toast({
      title: bookmarkedPosts[postId] ? "Bookmark removed" : "Bookmark added",
      description: bookmarkedPosts[postId] 
        ? "Article removed from your bookmarks" 
        : "Article saved to your bookmarks",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex flex-1 w-full overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Latest Content</h1>
              </div>
              
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No articles found</h3>
                  <p className="text-muted-foreground mt-2">
                    Check back later for new content
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      liked={!!likedPosts[post.id]}
                      onLike={() => handleLike(post.id)}
                      bookmarked={!!bookmarkedPosts[post.id]}
                      onBookmark={() => handleBookmark(post.id)}
                    />
                  ))}
                </div>
              )}
              
              {posts.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Load more articles
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
