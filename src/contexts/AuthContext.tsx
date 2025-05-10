
import React, { createContext, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    user, 
    setUser, 
    session, 
    setSession, 
    loading, 
    setLoading, 
    signUp, 
    signIn, 
    signInWithGoogle, 
    signOut 
  } = useSupabaseAuth();

  useEffect(() => {
    console.log('AuthProvider: Initializing auth context');
    
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change detected:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    // THEN check for existing session
    const initializeAuth = async () => {
      console.log('AuthProvider: Checking for existing session');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          console.log('AuthProvider: Existing session found');
        } else {
          console.log('AuthProvider: No existing session');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (error) {
          console.error('AuthProvider: Error fetching session:', error);
        }
      } catch (error) {
        console.error('AuthProvider: Error in auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      console.log('AuthProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading]);

  const value = {
    user,
    session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
