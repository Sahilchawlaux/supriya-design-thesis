
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { 
  Home, 
  Layout, 
  Image, 
  MessageSquare, 
  User, 
  ShoppingBag, 
  LogOut 
} from "lucide-react";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home size={18} /> },
    { path: "/admin/home", label: "Edit Home Page", icon: <Layout size={18} /> },
    { path: "/admin/about", label: "Edit About Page", icon: <User size={18} /> },
    { path: "/admin/portfolio", label: "Manage Portfolio", icon: <Image size={18} /> },
    { path: "/admin/testimonials", label: "Testimonials", icon: <MessageSquare size={18} /> },
    { path: "/admin/collections", label: "Digital Collections", icon: <ShoppingBag size={18} /> },
  ];

  return (
    <aside className="bg-charcoal text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-display text-xl">Admin Panel</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                location.pathname === item.path
                  ? "bg-white/10 text-gold"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white/80 hover:text-white"
          onClick={logout}
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
