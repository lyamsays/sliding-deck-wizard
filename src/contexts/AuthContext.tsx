
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    console.log("Sign in with:", email, password);
    // Mock sign-in logic
    setUser({
      id: "user-123",
      email,
      user_metadata: {
        full_name: "Test User",
        avatar_url: "https://example.com/avatar.png"
      }
    });
  };

  const signUp = async (email: string, password: string) => {
    console.log("Sign up with:", email, password);
    // Mock sign-up logic (can mirror signIn logic)
    await signIn(email, password);
  };

  const signInWithGoogle = async () => {
    console.log("Signing in with Google...");
    // Mock Google sign-in logic
    setUser({
      id: "google-user-456",
      email: "googleuser@example.com",
      user_metadata: {
        full_name: "Google User",
        avatar_url: "https://example.com/google-avatar.png"
      }
    });
  };

  const signOut = async () => {
    console.log("Signing out...");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
