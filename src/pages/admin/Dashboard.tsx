
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Package,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    sales: 0,
    revenue: 0,
    users: 0,
    views: 0
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [popularCollections, setPopularCollections] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching dashboard data
    setTimeout(() => {
      setStats({
        sales: 37,
        revenue: 1245.99,
        users: 127,
        views: 3842
      });

      setRecentOrders([
        { id: "ORD-1234", customer: "Emily Johnson", date: "2025-04-03", total: 39.99, status: "completed" },
        { id: "ORD-1233", customer: "Michael Smith", date: "2025-04-03", total: 74.98, status: "processing" },
        { id: "ORD-1232", customer: "Sarah Williams", date: "2025-04-02", total: 29.99, status: "completed" },
        { id: "ORD-1231", customer: "David Brown", date: "2025-04-01", total: 44.99, status: "completed" },
      ]);

      setPopularCollections([
        { id: "1", title: "Elegant Florals", sales: 12, revenue: 479.88 },
        { id: "2", title: "Modern Minimalist", sales: 9, revenue: 314.91 },
        { id: "4", title: "Art Deco Glamour", sales: 8, revenue: 359.92 },
      ]);
    }, 500);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
              <p className="text-2xl font-semibold">{stats.sales}</p>
            </div>
            <div className="bg-gold/10 p-3 rounded-full">
              <ShoppingBag size={20} className="text-gold" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Revenue</p>
              <p className="text-2xl font-semibold">${stats.revenue.toFixed(2)}</p>
            </div>
            <div className="bg-gold/10 p-3 rounded-full">
              <DollarSign size={20} className="text-gold" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-2xl font-semibold">{stats.users}</p>
            </div>
            <div className="bg-gold/10 p-3 rounded-full">
              <Users size={20} className="text-gold" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Page Views</p>
              <p className="text-2xl font-semibold">{stats.views}</p>
            </div>
            <div className="bg-gold/10 p-3 rounded-full">
              <Eye size={20} className="text-gold" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="text-gold">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium p-2 pl-0">Order ID</th>
                    <th className="text-left font-medium p-2">Customer</th>
                    <th className="text-left font-medium p-2">Date</th>
                    <th className="text-left font-medium p-2">Total</th>
                    <th className="text-left font-medium p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-2 pl-0">{order.id}</td>
                      <td className="p-2">{order.customer}</td>
                      <td className="p-2">{order.date}</td>
                      <td className="p-2">${order.total.toFixed(2)}</td>
                      <td className="p-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Popular Collections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Popular Collections</CardTitle>
            <Link to="/admin/collections">
              <Button variant="ghost" size="sm" className="text-gold">
                <ChevronRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {popularCollections.map((collection) => (
                <div key={collection.id} className="flex items-center">
                  <div className="mr-4">
                    <Package size={24} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{collection.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {collection.sales} sales · ${collection.revenue.toFixed(2)} revenue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Link to="/admin/collections">
          <Button variant="outline" className="w-full justify-start h-auto py-4">
            <ShoppingBag size={18} className="mr-2 text-gold" />
            <span>Manage Collections</span>
          </Button>
        </Link>
        
        <Link to="/admin/testimonials">
          <Button variant="outline" className="w-full justify-start h-auto py-4">
            <Users size={18} className="mr-2 text-gold" />
            <span>Update Testimonials</span>
          </Button>
        </Link>
        
        <Link to="/admin/portfolio">
          <Button variant="outline" className="w-full justify-start h-auto py-4">
            <Calendar size={18} className="mr-2 text-gold" />
            <span>Edit Portfolio</span>
          </Button>
        </Link>
        
        <Link to="/admin/about">
          <Button variant="outline" className="w-full justify-start h-auto py-4">
            <TrendingUp size={18} className="mr-2 text-gold" />
            <span>Edit About Page</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
