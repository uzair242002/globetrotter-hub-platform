
import React from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

const AdminPage = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default AdminPage;
