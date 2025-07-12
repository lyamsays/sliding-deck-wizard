
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PresentationIcon, MenuIcon, X, Palette } from 'lucide-react';
import UserMenu from './UserMenu';
import NetworkIndicator from './ui/NetworkIndicator';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 sticky top-0">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <Logo />
            </Link>
          </div>
          
          {/* Mobile menu button - remains on the right */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          {/* Navigation links - simplified */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            <Link 
              to="/" 
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors px-4 py-2"
            >
              Home
            </Link>
            
            <Link 
              to="/create" 
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors px-4 py-2"
            >
              Create Presentation
            </Link>
            
            <Link 
              to="/themes" 
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors flex items-center gap-1 px-4 py-2"
            >
              <Palette className="h-4 w-4" />
              Themes
            </Link>
            
            {user && (
              <Link 
                to="/my-decks" 
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors px-4 py-2"
              >
                My Decks
              </Link>
            )}
          </div>
          
          {/* User menu or auth buttons - remains on the far right */}
          <div className="hidden lg:flex lg:items-center lg:ml-4">
            {user ? (
        <div className="flex items-center space-x-4">
          <NetworkIndicator />
          <UserMenu />
        </div>
            ) : (
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="flex items-center gap-2"
                >
                  <PresentationIcon className="h-4 w-4" /> 
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </nav>
        
        {/* Mobile menu - simplified */}
        <div className={`lg:hidden ${isMenuOpen ? 'fixed inset-0 z-50 bg-white/95' : 'hidden'}`}>
          <div className="fixed inset-0 z-50">
            <div className="flex h-16 items-center justify-between px-6">
              <Link to="/" className="-m-1.5 p-1.5">
                <Logo />
              </Link>
              <button
                type="button"
                className="rounded-md p-2.5 text-gray-700"
                onClick={toggleMenu}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root px-6">
              <div className="space-y-2 py-6">
                {/* Mobile Menu Links - simplified */}
                <Link
                  to="/"
                  className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                
                <Link
                  to="/create"
                  className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Presentation
                </Link>
                
                <Link
                  to="/themes"
                  className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Themes
                  </span>
                </Link>
                
                {user && (
                  <Link
                    to="/my-decks"
                    className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Decks
                  </Link>
                )}
              </div>
              
              <div className="border-t border-gray-200 py-6">
                {user ? (
                  <div className="px-3">
                    <UserMenu />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/signin"
                      className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 text-base font-semibold leading-7 bg-primary text-white hover:bg-primary/90 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Add spacer div that appears only when mobile menu is open */}
      {isMenuOpen && <div className="h-screen lg:hidden"></div>}
    </>
  );
};

export default Navbar;
