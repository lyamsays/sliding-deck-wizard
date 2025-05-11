
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PresentationIcon, MenuIcon, X, Palette } from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
          
          {/* Navigation links with dropdowns - now positioned to the right */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link 
                    to="/" 
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors px-4 py-2"
                  >
                    Home
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-semibold">
                    Product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/features"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Features</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Discover what makes Sliding.io special
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/how-it-works"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">How it Works</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              See our simple three-step process
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/pricing"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Pricing</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Free during our early access phase
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/faq"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">FAQ</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Common questions answered
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-semibold">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/about"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">About</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Our story and mission
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/blog"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Blog</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Articles and updates
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/careers"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Careers</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Join our growing team
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/contact"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Contact</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Get in touch with us
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-semibold">
                    Legal
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/privacy-policy"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Privacy Policy</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              How we handle your data
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/terms-of-service"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Terms of Service</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Rules for using our platform
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/security"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Security</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              How we keep your data safe
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link 
                    to="/create" 
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors px-4 py-2"
                  >
                    Create Slides
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link 
                    to="/themes" 
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors flex items-center gap-1 px-4 py-2"
                  >
                    <Palette className="h-4 w-4" />
                    Themes
                  </Link>
                </NavigationMenuItem>
                
                {user && (
                  <NavigationMenuItem>
                    <Link 
                      to="/my-decks" 
                      className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors px-4 py-2"
                    >
                      My Decks
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* User menu or auth buttons - remains on the far right */}
          <div className="hidden lg:flex lg:items-center lg:ml-4">
            {user ? (
              <UserMenu />
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
        
        {/* Mobile menu - with full-screen overlay */}
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
                {/* Mobile Menu Links */}
                <Link
                  to="/"
                  className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                
                {/* Product Section */}
                <div className="py-2">
                  <p className="px-3 text-base font-semibold leading-7 text-gray-900">Product</p>
                  <div className="ml-3">
                    <Link
                      to="/features"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      to="/how-it-works"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      How it Works
                    </Link>
                    <Link
                      to="/pricing"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link
                      to="/faq"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                  </div>
                </div>
                
                {/* Company Section */}
                <div className="py-2">
                  <p className="px-3 text-base font-semibold leading-7 text-gray-900">Company</p>
                  <div className="ml-3">
                    <Link
                      to="/about"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      to="/blog"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Blog
                    </Link>
                    <Link
                      to="/careers"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Careers
                    </Link>
                    <Link
                      to="/contact"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                </div>
                
                {/* Legal Section */}
                <div className="py-2">
                  <p className="px-3 text-base font-semibold leading-7 text-gray-900">Legal</p>
                  <div className="ml-3">
                    <Link
                      to="/privacy-policy"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/terms-of-service"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Terms of Service
                    </Link>
                    <Link
                      to="/security"
                      className="block px-3 py-2 text-base leading-7 text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Security
                    </Link>
                  </div>
                </div>
                
                <Link
                  to="/create"
                  className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Slides
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
