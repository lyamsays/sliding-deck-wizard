
import React from 'react';
import Logo from './Logo';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';

const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <header className="w-full py-4 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How it Works</a>
          <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/signin" className="hidden md:block text-gray-700 hover:text-primary font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="hidden md:block">
                <Button variant="secondary" className="hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <button className="md:hidden text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
