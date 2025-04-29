import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/authContext";

export default function LogoutPage() {
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    sessionStorage.clear();
    setIsLoggedIn(false);
  }, []);

  return <Navigate to="/" replace />;
}
