import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Testimonials from "./pages/Testimonials";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCollections from "./pages/admin/Collections";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminAbout from "./pages/admin/About";
import AdminHome from "./pages/admin/Home";

// Configure QueryClient with better defaults for Supabase realtime updates
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="testimonials" element={<Testimonials />} />
                <Route path="collections" element={<Collections />} />
                <Route path="collections/:id" element={<CollectionDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="success" element={<Success />} />
                <Route path="login" element={<Login />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="collections" element={<AdminCollections />} />
                <Route path="portfolio" element={<AdminPortfolio />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="home" element={<AdminHome />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
