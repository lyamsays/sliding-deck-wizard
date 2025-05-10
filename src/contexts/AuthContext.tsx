
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
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (error) {
          console.error('Error fetching session:', error);
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
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
