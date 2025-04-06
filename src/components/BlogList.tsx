
import { blogs } from "@/lib/data";
import BlogCard from "@/components/BlogCard";

export default function BlogList() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Latest Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
