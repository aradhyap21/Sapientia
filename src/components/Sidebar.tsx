
import { BookmarkIcon, FileText, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { blogs } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  const savedBlogs = blogs.filter(blog => blog.saved);
  
  return (
    <aside className="w-64 hidden md:block bg-sidebar border-r p-5 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {isAuthenticated && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  <span>Saved Articles</span>
                </div>
              </h3>
              {savedBlogs.length > 0 ? (
                <ul className="space-y-2">
                  {savedBlogs.map((blog) => (
                    <li key={blog.id} className="text-sm">
                      <Link 
                        to={`/blog/${blog.id}`} 
                        className="block text-gray-700 hover:text-primary overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {blog.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No saved articles yet</p>
              )}
              {savedBlogs.length > 0 && (
                <Link to="/saved">
                  <Button variant="link" size="sm" className="mt-2 p-0">
                    View all saved
                  </Button>
                </Link>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>My Blogs</span>
                </div>
              </h3>
              <Link to="/write">
                <Button className="w-full" size="sm">Write a new blog</Button>
              </Link>
            </div>
          </>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>About Us</span>
            </div>
          </h3>
          <p className="text-sm text-gray-600">
            BlogHub is a community platform for writers and readers to connect through meaningful content.
          </p>
          <Link to="/about">
            <Button variant="link" size="sm" className="mt-1 p-0">
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
