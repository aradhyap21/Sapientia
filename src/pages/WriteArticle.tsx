import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useBlogContext } from "@/context/BlogContext";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { Save, Image, Send, ArrowLeft, Clock, Eye, PenTool } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { renderMarkdown } from "@/lib/markdown";

export default function WriteArticle() {
  const { isAuthenticated, user } = useAuth();
  const { addBlog, blogs, updateBlog } = useBlogContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast: uiToast } = useToast();
  
  // Check for edit mode
  const queryParams = new URLSearchParams(location.search);
  const editBlogId = queryParams.get('edit');
  const editMode = Boolean(editBlogId);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [tagArray, setTagArray] = useState<string[]>([]);
  const [renderedPreview, setRenderedPreview] = useState<string>("");

  // Load blog data if in edit mode
  useEffect(() => {
    if (editMode && editBlogId) {
      const blogToEdit = blogs.find(blog => blog.id === editBlogId);
      if (blogToEdit) {
        setTitle(blogToEdit.title || "");
        setContent(blogToEdit.content || "");
        setTags(blogToEdit.tags?.join(", ") || "");
        if (blogToEdit.coverImage) {
          setPreviewImage(blogToEdit.coverImage);
        }
      }
    }
  }, [editMode, editBlogId, blogs]);

  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      setWordCount(words);
      setReadTime(Math.ceil(words / 200));
    } else {
      setWordCount(0);
      setReadTime(0);
    }
  }, [content]);

  useEffect(() => {
    let score = 0;
    if (title.length > 5) score += 30;
    if (content.length > 100) score += 40;
    if (tagArray.length > 0) score += 15;
    if (coverImage || previewImage) score += 15;
    setProgress(score);
  }, [title, content, tagArray, coverImage, previewImage]);

  useEffect(() => {
    setTagArray(tags ? tags.split(",").map(tag => tag.trim()).filter(tag => tag) : []);
  }, [tags]);

  useEffect(() => {
    if (title || content) {
      const timeoutId = setTimeout(() => {
        setIsAutoSaving(true);
        setTimeout(() => {
          setIsAutoSaving(false);
        }, 1000);
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [title, content]);
  
  // Update preview content when content changes or tab switches
  useEffect(() => {
    if (content && activeTab === "preview") {
      setRenderedPreview(renderMarkdown(content));
    }
  }, [content, activeTab]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() === "" || content.trim() === "") {
      sonnerToast("Please fill in all required fields", {
        description: "Title and content are required to publish a Blog.",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const excerpt = content.substring(0, 150) + (content.length > 150 ? "..." : "");
      const blogData = {
        title,
        content,
        excerpt,
        coverImage: previewImage,
        author: {
          id: user?.id || "unknown",
          name: user?.name || "Anonymous",
        },
        status: "published" as "published" | "draft",
        tags: tagArray,
        readTime,
        comments: [], // Initialize with empty comments array
      };
      
      if (editMode && editBlogId) {
        // Update existing blog
        updateBlog(editBlogId, blogData);
        sonnerToast("Blog updated successfully!", {
          description: "Your changes have been saved.",
        });
      } else {
        // Create new blog
        const newBlog = addBlog(blogData);
        sonnerToast("Blog published successfully!", {
          description: "Your blog is now live.",
        });
      }
      
      navigate("/my-blogs");
    } catch (error) {
      uiToast({
        variant: "destructive",
        title: "Failed to publish",
        description: "There was an error publishing your blog. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    if (!title.trim()) {
      sonnerToast("Title required", {
        description: "Please provide a title for your draft.",
        duration: 3000,
      });
      return;
    }

    try {
      const excerpt = content ? content.substring(0, 150) + (content.length > 150 ? "..." : "") : "Draft in progress...";
      const blogData = {
        title,
        content: content || "Draft in progress...",
        excerpt,
        coverImage: previewImage,
        author: {
          id: user?.id || "unknown",
          name: user?.name || "Anonymous",
        },
        status: "draft" as "published" | "draft",
        tags: tagArray,
        readTime: readTime || 1,
        comments: [], // Initialize with empty comments array
      };
      
      if (editMode && editBlogId) {
        updateBlog(editBlogId, blogData);
        sonnerToast("Draft updated successfully!", {
          description: "Your changes have been saved.",
        });
      } else {
        addBlog(blogData);
        sonnerToast("Draft saved successfully!", {
          description: "You can continue editing it later.",
        });
      }
      
      navigate("/my-blogs");
    } catch (error) {
      uiToast({
        variant: "destructive",
        title: "Failed to save draft",
        description: "There was an error saving your draft. Please try again.",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md rounded-xl p-8 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {editMode ? "Edit Blog" : "Write a New Blog"}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <PenTool className="h-4 w-4 mr-1" />
                    <span>{wordCount} words</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{readTime} min read</span>
                  </div>
                  {isAutoSaving && (
                    <div className="flex items-center text-amber-600 animate-pulse">
                      <Save className="h-4 w-4 mr-1" />
                      <span>Saving...</span>
                    </div>
                  )}
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-32">
                      <Progress value={progress} className="h-2" />
                      <span className="text-xs text-gray-500 mt-1 block text-right">{progress}% complete</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Complete all sections to reach 100%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                <div className="space-y-8">
                  <div>
                    <Label htmlFor="title" className="text-lg font-medium">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter an engaging title"
                      className="text-xl mt-2 py-6 font-medium placeholder:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="content" className="text-lg font-medium">
                        Content <span className="text-red-500">*</span>
                      </Label>
                      <div className="text-sm text-gray-500 flex items-center">
                        <PenTool className="h-4 w-4 mr-1" />
                        <span>Supports Markdown</span>
                      </div>
                    </div>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-2">
                        <TabsTrigger value="write" className="flex items-center gap-2">
                          <PenTool className="h-4 w-4" />
                          Write
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Preview
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="write">
                        <Textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write your blog content here..."
                          className="min-h-[400px] font-mono resize-y border-gray-200 focus:border-primary"
                        />
                      </TabsContent>
                      
                      <TabsContent value="preview">
                        {content ? (
                          <div className="prose prose-blue max-w-none min-h-[400px] p-6 border rounded-lg overflow-auto bg-gray-50">
                            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
                          </div>
                        ) : (
                          <div className="min-h-[400px] p-6 border rounded-lg text-gray-400 flex flex-col items-center justify-center bg-gray-50/50">
                            <Eye className="h-12 w-12 mb-2 text-gray-300" />
                            <p>Nothing to preview yet</p>
                            <p className="text-sm">Start writing to see a preview</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <Label htmlFor="cover-image" className="text-lg font-medium">Cover Image</Label>
                    <div 
                      className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center ${previewImage ? 'border-primary/30 bg-primary/5' : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'} transition-colors`}
                    >
                      {previewImage ? (
                        <div className="relative">
                          <img 
                            src={previewImage} 
                            alt="Cover preview" 
                            className="rounded-md object-cover w-full aspect-video"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="bg-white"
                              onClick={() => {
                                setCoverImage(null);
                                setPreviewImage(null);
                              }}
                            >
                              Remove Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="cover-image-input" className="cursor-pointer block">
                          <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Click to upload a cover image
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Recommended size: 1200 x 630 pixels
                          </p>
                          <Input
                            id="cover-image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags" className="text-lg font-medium">Tags</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="technology, science, ..."
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Add relevant tags to help readers find your blog (separated by commas)
                    </p>
                    
                    {tagArray.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tagArray.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium mb-3">Publishing Options</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Send className="h-4 w-4 mr-2 text-primary" />
                        This will be published immediately
                      </p>
                      <p className="flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-primary" />
                        Visible to all readers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </Button>
                <div className="space-x-4">
                  <Button 
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="border-primary text-primary hover:bg-primary/5"
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Publish Blog
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
