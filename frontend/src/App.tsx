import { Routes, Route, Navigate } from "react-router-dom";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";

import { useAuth } from "./context/authContext";
import ApplyPage from "./pages/ApplyPage";
import ApprovalPage from "./pages/ApprovalPage";
import EmployeePage from "./pages/EmployeePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import PersonalPage from "./pages/PersonalPage";

function App() {
  const { isLoggedIn, userName, role } = useAuth();

  return (
    <div className="flex h-screen flex-col">
      <Header userName={userName || ""} isLoggedIn={isLoggedIn} />
      <div className="flex flex-1">
        {isLoggedIn && (
          <div className="w-[18%]">
            <Sidebar role={role ?? undefined} />
          </div>
        )}
        <div
          className={`flex flex-1 overflow-hidden bg-background ${
            isLoggedIn ? "pb-12 pl-20 pt-28" : "pt-20"
          }`}
        >
          <Routes>
            {!isLoggedIn ? (
              <Route path="/*" element={<LoginPage />} />
            ) : (
              <>
                <Route path="/apply-form" element={<ApplyPage />} />
                <Route path="/personal-overview" element={<PersonalPage />} />
                <Route path="/approval" element={<ApprovalPage />} />
                <Route path="/employee-overview" element={<EmployeePage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="*" element={<Navigate to="/apply-form" />} />
              </>
            )}
          </Routes>
          <Toaster />
        </div>
      </div>
    </div>
  );
}

export default App;
