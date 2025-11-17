
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated or not an admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
