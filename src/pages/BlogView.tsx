import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBlogContext } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import CommentSection from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, ArrowLeft, Edit2, AlertCircle } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";

export default function BlogView() {
  const { id } = useParams<{ id: string }>();
  const { blogs } = useBlogContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formattedContent, setFormattedContent] = useState<string>("");

  const blog = blogs.find(blog => blog.id === id);
  const isAuthor = user?.id === blog?.author?.id;

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (blog?.content) {
      // Process the content for display
      const htmlContent = blog.content.replace(/\n/g, '<br>');
      setFormattedContent(htmlContent);
    }
  }, [blog?.content]);

  // Handle case when blog is not found
  if (!isLoading && !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 max-w-5xl mx-auto">
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
              <AlertCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-medium text-gray-700 mb-2">Blog Not Found</h2>
              <p className="text-gray-500 mb-6">The blog you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-10"></div>
              <div className="h-64 bg-gray-200 rounded w-full mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                
                {isAuthor && (
                  <Button onClick={() => navigate(`/write?edit=${id}`)}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
              
              <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                {blog?.coverImage && (
                  <div className="w-full h-[300px] overflow-hidden">
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-8">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    {blog?.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-8 text-gray-600 border-b pb-6 border-gray-100">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{blog?.author?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{blog?.author?.name || "Unknown author"}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {blog?.createdAt 
                          ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                              year: "numeric", month: "long", day: "numeric"
                            }) 
                          : "Unknown date"
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{blog?.readTime || "?"} min read</span>
                    </div>
                  </div>
                  
                  {blog?.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div 
                    className="prose prose-lg max-w-none prose-blue"
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  />
                  
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-xl font-semibold mb-4">About the author</h3>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{blog?.author?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{blog?.author?.name || "Unknown author"}</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Author of articles on Sapientia
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {blog && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <CommentSection blog={blog} />
                    </div>
                  )}
                </div>
              </article>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
