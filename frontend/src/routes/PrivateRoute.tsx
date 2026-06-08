import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { type Rol } from "../models/Auth";
import { type ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  rol?: Rol;
}

export default function PrivateRoute({ children, rol }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (rol && user.rol !== rol) {
    return <Navigate to="/lista" />;
  }

  return children;
}