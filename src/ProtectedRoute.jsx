import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  try {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    // Check if user is logged in
    if (!user) {
      return <Navigate to="/login" />;
    }

    // Check if user has required role
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/" />;
    }

    return children;
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
