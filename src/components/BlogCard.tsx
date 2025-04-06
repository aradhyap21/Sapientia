
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bookmark, MessageCircle, Heart } from "lucide-react";
import { Blog } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
  className?: string;
}

export default function BlogCard({ blog, className }: BlogCardProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(blog.saved || false);
  const [likeCount, setLikeCount] = useState(blog.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Article removed from saved" : "Article saved",
      description: isSaved 
        ? "The article has been removed from your saved items"
        : "The article has been saved to your profile",
    });
  };

  return (
    <Link to={`/blog/${blog.id}`}>
      <Card className={cn("h-full hover:shadow-md transition-shadow", className)}>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{blog.author.name}</p>
                <p className="text-xs text-gray-500">
                  {blog.publishedAt} · {blog.readTime}
                </p>
              </div>
            </div>
            <button onClick={handleSave} className="text-gray-500 hover:text-primary">
              <Bookmark className={cn("h-5 w-5", isSaved && "fill-primary text-primary")} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h3>
          <p className="text-gray-600 line-clamp-3 text-sm">{blog.excerpt}</p>
          
          {blog.coverImage && (
            <div className="mt-3">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-md"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary"
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
              <span className="text-xs">{likeCount}</span>
            </button>
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{blog.comments.length}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
