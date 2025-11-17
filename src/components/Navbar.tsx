import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import React from "react";
import logoText from "../assets/design-thesis-logo-text.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/collections", label: "Shop" },
    { path: "/contact", label: "Contact" },
  ];

  // Close user menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      setIsUserMenuOpen(false);
    }
  };

  // Add and remove click outside listener
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          {/* <img src={logo} alt="The Design Thesis Logo" className="h-10 w-10 object-contain" /> */}
          {/* <span className="font-serif text-xl md:text-2xl tracking-tight">
            The Design Thesis
          </span> */}
          <img
            src={logoText}
            alt="The Design Thesis Logo"
            className="h-14 w-auto max-h-20 max-w-[180px] sm:h-16 sm:max-w-[220px] md:h-20 md:max-w-[260px]"
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-sm uppercase tracking-widest hover:text-primary transition-colors ${
                location.pathname === link.path 
                  ? "text-primary elegant-underline" 
                  : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User menu & cart - desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <div className="relative user-menu-container">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={18} />
                <span className="text-sm">{user.name}</span>
              </Button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1">
                  {user.isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm hover:bg-secondary"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-secondary"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-sm uppercase tracking-widest">Sign In</Button>
            </Link>
          )}
          
          <Link to="/checkout" className="relative">
            <Button variant="ghost" className="p-2">
              <ShoppingBag size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-4">
          <Link to="/checkout" className="relative">
            <Button variant="ghost" size="sm" className="p-1">
              <ShoppingBag size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-1"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-4 px-6 animate-fade-in">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-base uppercase tracking-widest ${
                  location.pathname === link.path 
                    ? "text-primary" 
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border mt-4">
              {user ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Signed in as {user.name}</p>
                  {user.isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost" 
                    className="w-full text-left p-0 justify-start h-auto text-base"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-base uppercase tracking-widest"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
