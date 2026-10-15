
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { user, loading, isAuthenticated } = useAuth();

  // Wait until refresh-token authentication completes.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-600">
          Restoring your session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles?.length &&
    !allowedRoles.map(Number).includes(Number(user?.role_id))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}
