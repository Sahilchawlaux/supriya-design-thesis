import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import logoText from "../assets/design-thesis-logo-text.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/contact", label: "Contact" },
  ];

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
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 outline-none focus-visible:ring-0"
                >
                  <User size={18} className="text-black" />
                  <span className="text-sm text-black">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border border-border rounded-12 shadow-lg py-1">
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/admin" 
                      className="cursor-pointer block w-full"
                    >
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Link to="/checkout" className="relative">
            <Button variant="ghost" className="p-2 text-foreground hover:text-primary">
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
            <Button variant="ghost" size="sm" className="p-1 text-foreground hover:text-primary">
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
            className="p-1 text-foreground hover:text-primary rounded-full bg-muted hover:bg-muted"
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
              {user && (
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
                    onClick={logout}
                    variant="ghost" 
                    className="w-full text-left p-0 justify-start h-auto text-base text-destructive hover:text-destructive hover:bg-transparent"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
