import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { blogs } from "@/lib/data";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import CommentSection from "@/components/CommentSection";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const blog = blogs.find((blog) => blog.id === id);
  const [isSaved, setIsSaved] = useState(false);
  
  // Update isSaved state when blog changes
  useEffect(() => {
    if (blog) {
      // Check if this blog is saved in localStorage
      const savedBlogs = JSON.parse(localStorage.getItem('savedBlogs') || '[]');
      setIsSaved(savedBlogs.includes(blog.id));
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">Blog post not found</h2>
              <p className="mt-2">The blog post you're looking for doesn't exist or has been removed.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    // Update localStorage
    const savedBlogs = JSON.parse(localStorage.getItem('savedBlogs') || '[]');
    if (newSavedState) {
      savedBlogs.push(blog.id);
    } else {
      const index = savedBlogs.indexOf(blog.id);
      if (index !== -1) savedBlogs.splice(index, 1);
    }
    localStorage.setItem('savedBlogs', JSON.stringify(savedBlogs));
    
    toast({
      title: newSavedState ? "Article saved" : "Article removed from saved",
      description: newSavedState
        ? "The article has been saved to your profile"
        : "The article has been removed from your saved items",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-4xl mx-auto">
          <article>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                    <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{blog.author.name}</p>
                    <p className="text-sm text-gray-500">
                      {blog.publishedAt 
                        ? new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }).format(new Date(blog.publishedAt))
                        : "No date"} · {blog.readTime || "? min read"}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSave}
                  className={cn(isSaved && "text-primary")}
                >
                  <Bookmark className={cn("h-4 w-4 mr-2", isSaved && "fill-primary")} />
                  {isSaved ? "Saved" : "Save"}
                </Button>
              </div>
              
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
                />
              )}
              
              <div 
                className="blog-content prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
            
            <CommentSection blog={blog} />
          </article>
        </main>
      </div>
    </div>
  );
}
