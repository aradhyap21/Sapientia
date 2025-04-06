
import React from "react";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { blogs } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function MyBlogs() {
  const { user } = useAuth();
  
  // Filter blogs to only show those from the current user
  const myBlogs = blogs.filter(blog => blog.author.id === user?.id);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Published Blogs</h1>
                <Link to="/write">
                  <Button>Write New Article</Button>
                </Link>
              </div>
              
              {myBlogs.length > 0 ? (
                <div className="space-y-4">
                  {myBlogs.map((blog) => (
                    <Card key={blog.id} className="overflow-hidden border-l-4 border-l-primary">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {blog.coverImage && (
                            <div className="w-full md:w-48 h-40">
                              <img 
                                src={blog.coverImage} 
                                alt={blog.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{blog.excerpt}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-auto">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{blog.publishedAt}</span>
                            </div>
                            <div className="flex space-x-2 mt-4">
                              <Link to={`/blog/${blog.id}`}>
                                <Button variant="outline" size="sm">View</Button>
                              </Link>
                              <Link to={`/write?edit=${blog.id}`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">You haven't published any blogs yet.</p>
                  <Link to="/write">
                    <Button>Write Your First Blog</Button>
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
