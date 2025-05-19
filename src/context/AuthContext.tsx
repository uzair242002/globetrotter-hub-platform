
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the User type
type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked?: boolean;
}

// Define the AuthContext type
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@travel.com",
    role: "admin",
    isBlocked: false,
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@travel.com",
    role: "user",
    isBlocked: false,
  },
];

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock database
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      setIsLoading(false);
      throw new Error("User not found");
    }
    
    if (user.role !== role) {
      setIsLoading(false);
      throw new Error("Invalid role for this user");
    }
    
    if (user.isBlocked) {
      setIsLoading(false);
      throw new Error("Your account has been blocked");
    }
    
    // Set current user and save to localStorage
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoading(false);
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      setIsLoading(false);
      throw new Error("User already exists");
    }
    
    // Create new user
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      role,
      isBlocked: false,
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    // Set current user and save to localStorage
    setCurrentUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
