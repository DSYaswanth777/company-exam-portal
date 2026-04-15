import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminNotifications from "./pages/AdminNotifications";
import AdminColleges from "./pages/AdminColleges";
import AdminDirectMessaging from "./pages/AdminDirectMessaging";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  function TitleHandler() {
    const location = useLocation();

    useEffect(() => {
      const pathTitleMap = {
        "/admin/login": "Admin Login | Assessflow",
        "/admin": "Admin Dashboard | Assessflow",
        "/admin-dashboard": "Admin Dashboard | Assessflow",
        "/admin-notifications": "Admin Notifications | Assessflow",
        "/admin-colleges": "College Management | Assessflow",
        "/admin-messages": "Direct Messaging | Assessflow",
      };

      const title = pathTitleMap[location.pathname] || "Admin Portal | Assessflow";
      document.title = title;
    }, [location]);

    return null;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <TitleHandler />
          <div className="relative z-0 bg-primary min-h-screen flex flex-col">
            <main className="grow">
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route
                  path="/admin"
                  element={
                    <RequireAuth allowedTypes={["admin"]}>
                      <AdminDashboard />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/admin-dashboard"
                  element={
                    <RequireAuth allowedTypes={["admin"]}>
                      <AdminDashboard />
                    </RequireAuth>
                  }
                />
                
                <Route
                   path="/admin-notifications"
                   element={
                     <RequireAuth allowedTypes={["admin"]}>
                       <AdminNotifications />
                     </RequireAuth>
                   }
                />

                <Route
                   path="/admin-colleges"
                   element={
                     <RequireAuth allowedTypes={["admin"]}>
                       <AdminColleges />
                     </RequireAuth>
                   }
                />

                <Route
                   path="/admin-messages"
                   element={
                     <RequireAuth allowedTypes={["admin"]}>
                       <AdminDirectMessaging />
                     </RequireAuth>
                   }
                />

                {/* Redirect root to admin login */}
                <Route path="/" element={<Navigate to="/admin/login" replace />} />
                
                {/* Catch all redirect to admin login */}
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
