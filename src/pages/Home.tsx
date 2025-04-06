
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import BlogList from "@/components/BlogList";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-background">
            <BlogList />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
