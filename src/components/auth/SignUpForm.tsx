
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { FaLock, FaGoogle } from 'react-icons/fa';


const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SignUpForm: Starting sign-up process');
    setIsLoading(true);
    
    try {
      console.log('SignUpForm: Attempting to sign up with email:', email);
      await signUp(email, password);
      console.log('SignUpForm: Sign-up successful, redirecting to home page');
      navigate('/');
    } catch (error: any) {
      console.error('SignUpForm Error:', error);
      toast({
        variant: "destructive",
        title: "Sign-up failed",
        description: error.message || "Could not create your account. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    console.log('SignUpForm: Attempting to sign up with Google');
    try {
      await signInWithGoogle();
      console.log('SignUpForm: Google sign-in flow initiated');
      // Redirection is handled by the OAuth provider
    } catch (error: any) {
      console.error('Google Sign-up Error:', error);
      toast({
        variant: "destructive",
        title: "Google sign-in failed",
        description: error.message || "Could not sign in with Google. Please try again."
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-sm text-gray-500 mt-2">Enter your details to get started</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <Button
  type="button"
  variant="outline"
  className="w-full flex items-center justify-center gap-2"
  onClick={handleGoogleSignUp}
>
  <FaGoogle className="mr-1" />
  Sign up with Google
  <span className="flex items-center text-xs text-gray-500 ml-2">
    <FaLock className="mr-1" /> Secure
  </span>
</Button>
    </div>
  );
};

export default SignUpForm;
