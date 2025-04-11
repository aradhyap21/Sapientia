// Core imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// UI components
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { Calendar, Heart, MessageSquare, Clock, Bookmark, Search, Filter, Loader2 } from "lucide-react";

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
  topics: string[];
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
    comments: 14,
    topics: ["Technology", "Quantum Physics", "Computer Science"]
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
    comments: 8,
    topics: ["Environment", "Climate", "Policy"]
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
    comments: 17,
    topics: ["Technology", "AI", "Machine Learning"]
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
    comments: 11,
    topics: ["Environment", "Energy", "Sustainability"]
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
    comments: 9,
    topics: ["Health", "Psychology", "Wellness"]
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
    comments: 12,
    topics: ["Technology", "Blockchain", "Finance"]
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
            <div className="flex flex-wrap gap-2 mb-3">
              {post.topics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-0.5">
                  {topic}
                </Badge>
              ))}
            </div>
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

const PostCardSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-sm">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 h-48 md:h-auto">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="md:w-2/3 p-4 flex flex-col">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-3">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </div>
    </div>
  </Card>
);

export default function Latest() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<number, boolean>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [activeCategory, setActiveCategory] = useState("all");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Extract all unique topics from posts
  const allTopics = Array.from(
    new Set(latestContent.flatMap(post => post.topics))
  );

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPosts(latestContent);
      setFilteredPosts(latestContent);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort posts when criteria change
  useEffect(() => {
    if (posts.length === 0) return;

    let result = [...posts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(post =>
        post.topics.includes(activeCategory)
      );
    }

    // Sort posts
    switch (sortOption) {
      case "latest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "popular":
        result.sort((a, b) => b.likes - a.likes);
        break;
      case "comments":
        result.sort((a, b) => b.comments - a.comments);
        break;
      default:
        break;
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, sortOption, activeCategory]);

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
                <h1 className="text-3xl font-bold">Trending Content</h1>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="w-full md:w-[300px] pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs 
                  defaultValue="all" 
                  className="w-full sm:w-auto"
                  onValueChange={setActiveCategory}
                >
                  <TabsList className="overflow-x-auto w-full sm:w-auto justify-start">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {allTopics.slice(0, 5).map((topic, index) => (
                      <TabsTrigger key={index} value={topic}>
                        {topic}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center gap-2">
                  <Select 
                    defaultValue="latest" 
                    onValueChange={setSortOption}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="comments">Most Discussed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid gap-6">
                  {Array(3).fill(0).map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No articles found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try changing your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredPosts.map((post) => (
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
              
              {filteredPosts.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load more articles"
                    )}
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
