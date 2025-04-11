import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Edit2, Trash2, AlertCircle, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBlogContext, Blog } from "@/context/BlogContext";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyBlogs() {
  const { isAuthenticated, user } = useAuth();
  const { blogs, deleteBlog, fetchBlogs } = useBlogContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("published");
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch blogs when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      const loadBlogs = async () => {
        try {
          setIsLoading(true);
          setError(null);

          // Ensure blogs are fetched (if your context supports this)
          if (typeof fetchBlogs === "function") {
            await fetchBlogs();
          }

          console.log("Blogs loaded:", blogs);
        } catch (err) {
          console.error("Error loading blogs:", err);
          setError("Failed to load blogs. Please try again.");
          toast("Error loading blogs", {
            description: "Please refresh the page and try again.",
          });
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      };

      loadBlogs();
    }
  }, [isAuthenticated, user, fetchBlogs]);

  const handleDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;

    try {
      await deleteBlog(selectedBlog.id);
      toast("Blog deleted successfully", {
        description: "Your blog has been permanently removed.",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast("Failed to delete blog", {
        description: "Please try again later.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedBlog(null);
    }
  };

  // Filter blogs based on active tab and current user
  const userBlogs = user?.id
    ? blogs.filter((blog) => blog.author?.id === user.id)
    : [];

  console.log("User ID:", user?.id);
  console.log("All blogs:", blogs);
  console.log("User blogs:", userBlogs);

  const filteredBlogs =
    activeTab === "all"
      ? userBlogs
      : userBlogs.filter((blog) => blog.status === activeTab);

  console.log("Filtered blogs:", filteredBlogs);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Blogs</h1>
            <Link to="/write">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> New Blog
              </Button>
            </Link>
          </div>

          <Tabs
            defaultValue="published"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-6"
          >
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-red-300">
              <AlertCircle className="h-12 w-12 mx-auto text-red-400" />
              <h2 className="mt-4 text-xl font-medium text-gray-700">
                Error Loading Blogs
              </h2>
              <p className="mt-2 text-gray-500">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-6"
                variant="outline"
              >
                Refresh Page
              </Button>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      {blog.coverImage && (
                        <Link to={`/blog/${blog.id}`}>
                          <div className="mb-4 w-full h-40 overflow-hidden rounded-md">
                            <img 
                              src={blog.coverImage} 
                              alt={blog.title || "Blog cover"} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                      )}
                      <Link to={`/blog/${blog.id}`} className="hover:underline">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {blog.title || "Untitled Blog"}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mt-2">
                        {blog.excerpt || "No excerpt available"}
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-xs font-medium text-gray-500">
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "No date"}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {blog.readTime || "?"} min read
                        </span>
                        <div className="flex gap-1">
                          {blog.tags && blog.tags.length > 0 ? (
                            <>
                              {blog.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700"
                                >
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 2 && (
                                <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                                  +{blog.tags.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs font-medium text-gray-500">
                              No tags
                            </span>
                          )}
                        </div>
                        {blog.status === "draft" && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/write?edit=${blog.id}`)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(blog)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="mt-4 text-xl font-medium text-gray-700">
                No blogs found
              </h2>
              <p className="mt-2 text-gray-500">
                {activeTab === "published"
                  ? "You haven't published any blogs yet."
                  : activeTab === "draft"
                  ? "You don't have any drafts."
                  : "You haven't created any blogs yet."}
              </p>
              <Link to="/write" className="mt-6 inline-block">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Write your first blog
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              blog
              <strong className="font-semibold block mt-1">
                "{selectedBlog?.title}"
              </strong>
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
