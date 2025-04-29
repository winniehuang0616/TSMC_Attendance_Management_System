import { useState, useEffect } from "react";

import AuthContext, { UserRole } from "./authContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    const storedRole = sessionStorage.getItem("role") as UserRole | null;
    if (storedName && storedRole) {
      setUserName(storedName);
      setRole(storedRole);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (name: string, userRole: UserRole) => {
    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("role", userRole);
    setUserName(name);
    setRole(userRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.clear();
    setUserName(null);
    setRole(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userName, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
