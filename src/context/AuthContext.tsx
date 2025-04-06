
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types";
import { users } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    try {
      const foundUser = users.find((u) => u.email === email);
      
      if (foundUser) {
        // In a real app, we would verify the password here
        setUser(foundUser);
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        toast({
          title: "Logged in successfully!",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Authentication error",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "Something went wrong during login",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - in real app, this would call an API
    try {
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        toast({
          title: "Registration error",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }

      // In a real app, we would store this user in a database
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      };
      
      // Just for demo, add to our local users array
      users.push(newUser);
      
      setUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      
      toast({
        title: "Account created!",
        description: "You have successfully registered",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration error",
        description: "Something went wrong during registration",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Check if user is stored in localStorage on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
