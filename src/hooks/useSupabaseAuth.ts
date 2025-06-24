
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signUp = async (email: string, password: string) => {
    try {
      console.log('useSupabaseAuth: Starting sign-up process');
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('useSupabaseAuth: Sign-up error:', error);
        throw error;
      }

      console.log('useSupabaseAuth: Sign-up successful, verification status:', data?.user?.email_confirmed_at ? 'Confirmed' : 'Pending');
      
      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      const err = error as Error;
      console.error('useSupabaseAuth: Sign-up exception:', err);
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: err.message || "An unexpected error occurred",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('useSupabaseAuth: Starting sign-in process');
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('useSupabaseAuth: Sign-in error:', error);
        throw error;
      }

      console.log('useSupabaseAuth: Sign-in successful, user:', data?.user?.id);
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });
    } catch (error) {
      const err = error as Error;
      console.error('useSupabaseAuth: Sign-in exception:', err);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: err.message || "Invalid email or password",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('useSupabaseAuth: Starting Google sign-in flow');
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('useSupabaseAuth: Google sign-in error:', error);
        throw error;
      }
      
      console.log('useSupabaseAuth: Google sign-in flow initiated');
    } catch (error) {
      const err = error as Error;
      console.error('useSupabaseAuth: Google sign-in exception:', err);
      toast({
        variant: "destructive",
        title: "Error signing in with Google",
        description: err.message || "An unexpected error occurred",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('useSupabaseAuth: Starting sign-out process');
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('useSupabaseAuth: Sign-out error:', error);
        throw error;
      }
      
      console.log('useSupabaseAuth: Sign-out successful');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      const err = error as Error;
      console.error('useSupabaseAuth: Sign-out exception:', err);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: err.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};
