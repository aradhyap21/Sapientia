import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import BlogList from "@/components/BlogList";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg overflow-hidden mb-8">
      <div className="py-10 px-6 md:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover Knowledge, <span className="text-primary">Share Wisdom</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore curated content from experts across diverse fields.
              Expand your understanding through academic insights and cutting-edge research.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button size="lg">
                Explore Topics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Join Community
              </Button>
            </div>
            
            <div className="mt-8 flex items-center space-x-5">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">500+</span>
                <span className="text-sm text-muted-foreground">Blogs</span>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">120+</span>
                <span className="text-sm text-muted-foreground">Contributors</span>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">50+</span>
                <span className="text-sm text-muted-foreground">Categories</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute -top-8 -right-8 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80" 
              alt="Knowledge library"
              className="relative z-10 w-full h-auto rounded-lg shadow-2xl transform -rotate-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex flex-1 w-full">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 bg-background w-full overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <HeroSection />
              <BlogList />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
