
import React from "react";
import { UserDashboard } from "@/components/user/UserDashboard";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

const UserDashboardPage = () => {
  return (
    <ProtectedRoute requiredRole="user">
      <UserDashboard />
    </ProtectedRoute>
  );
};

export default UserDashboardPage;
