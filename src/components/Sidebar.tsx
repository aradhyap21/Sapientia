import { Bookmark as BookmarkIcon, FileText, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { blogs } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  const savedBlogs = blogs.filter(blog => blog.saved);
  
  return (
    <aside className="w-64 hidden md:flex flex-col bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6 min-h-[calc(100vh-4rem)] overflow-y-auto shadow-sm">
      <div className="space-y-10 flex-1">
        {isAuthenticated && (
          <>
            <div className="group">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <BookmarkIcon className="h-4 w-4 text-primary/90" />
                  <span>Saved Articles</span>
                </div>
              </h3>
              {savedBlogs.length > 0 ? (
                <ul className="space-y-3.5 pl-1.5">
                  {savedBlogs.map((blog) => (
                    <li key={blog.id} className="text-sm group/item">
                      <Link 
                        to={`/blog/${blog.id}`} 
                        className="block text-gray-700 hover:text-primary transition-colors duration-200 overflow-hidden text-ellipsis whitespace-nowrap py-1.5 hover:translate-x-0.5 transform transition-transform"
                      >
                        {blog.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-md">No saved articles yet</p>
              )}
              {savedBlogs.length > 0 && (
                <Link to="/saved">
                  <Button variant="link" size="sm" className="mt-4 p-0 text-primary hover:text-primary/80 font-medium">
                    View all saved →
                  </Button>
                </Link>
              )}
            </div>

            <div className="group">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-primary/90" />
                  <span>My Blogs</span>
                </div>
              </h3>
              <div className="space-y-5 pl-1.5">
                <Link to="/my-blogs">
                  <Button variant="outline" size="sm" className="w-full justify-start border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    View my blogs
                  </Button>
                </Link>
                <Link to="/write">
                  <Button className="w-full justify-start shadow-sm hover:shadow transition-all" size="sm">
                    Write a new blog
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}

        <div className="group">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-primary/90" />
              <span>About Us</span>
            </div>
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed pl-1.5 bg-gray-50/50 p-3 rounded-md border border-gray-100">
            Sapientia is a community platform for writers and readers to connect through meaningful content.
          </p>
          <Link to="/about">
            <Button variant="link" size="sm" className="mt-3 p-0 text-primary hover:text-primary/80 pl-1.5 font-medium">
              Learn more →
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
