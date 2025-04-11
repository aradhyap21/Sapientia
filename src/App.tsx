import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import WriteArticle from "./pages/WriteArticle";
import MyBlogs from "./pages/MyBlogs";
import Latest from "./pages/Latest";
import BlogView from "./pages/BlogView";
import { BlogProvider } from "./context/BlogContext";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/write",
    element: <WriteArticle />,
  },
  {
    path: "/my-blogs",
    element: <MyBlogs />,
  },
  {
    path: "/latest",
    element: <Latest />,
  },
  {
    path: "/blog/:id",
    element: <BlogView />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BlogProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </BlogProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
