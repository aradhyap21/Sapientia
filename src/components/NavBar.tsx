import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchIcon, Home, Clock, User, Settings, Crown, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // In a real app, implement actual search functionality
    setIsSearchOpen(false);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when navigating
    setMobileMenuOpen(false);
  }, [location]);

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <nav 
      className={cn(
        "bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 transition-all duration-300",
        scrolled ? "shadow-md" : "shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-cinzel font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all">
                sapientia
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-2">
              <Link
                to="/"
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all duration-200 hover:bg-primary/10",
                  isActiveLink("/") 
                    ? "text-primary bg-primary/5 font-semibold" 
                    : "text-gray-700"
                )}
              >
                <Home className="h-4 w-4 mr-2" /> Home
              </Link>
              <Link
                to="/latest"
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all duration-200 hover:bg-primary/10",
                  isActiveLink("/latest") 
                    ? "text-primary bg-primary/5 font-semibold" 
                    : "text-gray-700"
                )}
              >
                <Clock className="h-4 w-4 mr-2" /> Latest
              </Link>
            </div>
            <div className="ml-4 relative">
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.form 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearchSubmit} 
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="Search authors..."
                      className="border border-gray-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button 
                      type="button" 
                      className="ml-2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={toggleSearch}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSearch}
                    className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 border border-gray-200 hover:bg-primary/5">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-1 overflow-hidden border border-gray-100 rounded-xl shadow-lg" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4 pb-2 border-b border-gray-50">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <div className="p-1">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">
                        <User className="mr-2 h-4 w-4 text-primary/70" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">
                        <Settings className="mr-2 h-4 w-4 text-primary/70" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">
                        <Crown className="mr-2 h-4 w-4 text-primary/70" />
                        <span>Premium</span>
                        {user?.isPremium && (
                          <span className="ml-auto bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 font-medium">
                            Active
                          </span>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </div>
                  <DropdownMenuSeparator className="my-1" />
                  <div className="p-1">
                    <DropdownMenuItem onClick={logout} className="rounded-lg cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full px-5 transition-all border-gray-200 hover:border-primary hover:text-primary">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-full px-5 shadow-sm hover:shadow transition-all">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-3 py-4 space-y-3">
              <Link
                to="/"
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium flex items-center transition-all",
                  isActiveLink("/") 
                    ? "text-primary bg-primary/5 font-medium" 
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Home className="h-5 w-5 mr-3" /> Home
              </Link>
              <Link
                to="/latest"
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium flex items-center transition-all",
                  isActiveLink("/latest") 
                    ? "text-primary bg-primary/5 font-medium" 
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Clock className="h-5 w-5 mr-3" /> Latest
              </Link>
              <div className="px-4 py-3">
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search authors..."
                    className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="ml-2 p-2 rounded-md bg-primary/5 text-primary"
                  >
                    <SearchIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-semibold text-gray-800">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    <div className="mt-5 space-y-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-all"
                      >
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-3 text-primary/70" /> Profile
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-all"
                      >
                        <div className="flex items-center">
                          <Settings className="h-5 w-5 mr-3 text-primary/70" /> Settings
                        </div>
                      </Link>
                      <Link
                        to="/premium"
                        className="block px-4 py-3 rounded-lg text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-all"
                      >
                        <div className="flex items-center">
                          <Crown className="h-5 w-5 mr-3 text-primary/70" /> Premium
                          {user?.isPremium && (
                            <span className="ml-auto bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 font-medium">
                              Active
                            </span>
                          )}
                        </div>
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 rounded-lg text-base text-red-500 hover:bg-red-50 transition-all"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-5 w-5 mr-3" /> Log out
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-4 py-4 border-t border-gray-100 flex flex-col space-y-3">
                  <Link to="/login">
                    <Button variant="outline" className="w-full justify-center h-11 rounded-xl border-gray-200">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full justify-center h-11 rounded-xl">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
