import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/authContext";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return <Navigate to="/" replace />;
}
