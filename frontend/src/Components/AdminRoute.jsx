import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function AdminRoute() {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role ?? "")
    .replace(/^ROLE_/i, "")
    .toUpperCase();

  if (role !== "ADMIN") {
    return <Navigate to="/shop" replace />;
  }

  return <Outlet />;
}