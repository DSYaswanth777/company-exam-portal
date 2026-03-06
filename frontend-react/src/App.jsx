import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import AdminLogin from "./pages/AdminLogin";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyCreateDrive from "./pages/CompanyCreateDrive";
import CompanyDriveDetail from "./pages/CompanyDriveDetail";
import CompanySendEmails from "./pages/CompanySendEmails";
import CompanySupportTickets from "./pages/CompanySupportTickets";
import CompanyRaiseTicket from "./pages/CompanyRaiseTicket";
import Hero from "./components/Hero";
import Landing from "./components/Landing";
import Footer from "./components/Footer";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Licensing from "./pages/Licensing";
import Contact from "./pages/Contact";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = () => (
  <main className="max-w-4xl mx-auto p-6">
    <h1 className="text-3xl font-semibold">Welcome to Assessflow</h1>
    <p className="mt-4 text-muted-foreground">
      Use the navigation to login or register as a company or admin.
    </p>
  </main>
);

const App = () => {
  function RouteBasedHeader() {
    const location = useLocation();
    const noHeaderPaths = [
      "/admin",
      "/company",
      "/admin/login",
      "/company/login",
      "/company/register",
      "/student",
    ];
    if (noHeaderPaths.some((path) => location.pathname.startsWith(path))) {
      return null;
    }
    return (
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
      </div>
    );
  }

  function RouteBasedFooter() {
    const location = useLocation();
    const noFooterPaths = [
      "/admin",
      "/company",
      "/admin/login",
      "/company/login",
      "/company/register",
      "/student",
    ];
    if (noFooterPaths.some((path) => location.pathname.startsWith(path))) {
      return null;
    }
    return <Footer />;
  }

  function TitleHandler() {
    const location = useLocation();

    useEffect(() => {
      const pathTitleMap = {
        "/": "Assessflow | Hiring Platform",
        "/admin/login": "Admin Login | Assessflow",
        "/company/login": "Company Login | Assessflow",
        "/company/register": "Company Registration | Assessflow",
        "/admin": "Admin Dashboard | Assessflow",
        "/admin-dashboard": "Admin Dashboard | Assessflow",
        "/company": "Company Dashboard | Assessflow",
        "/company-dashboard": "Company Dashboard | Assessflow",
        "/company-create-drive": "Create New Drive | Assessflow",
        "/company-drive-detail": "Drive Details | Assessflow",
        "/company-send-emails": "Send Invitations | Assessflow",
        "/company-tickets": "Support Tickets | Assessflow",
        "/company-raise-ticket": "Raise Ticket | Assessflow",
        "/student/login": "Student Login | Assessflow",
        "/student/instructions": "Exam Instructions | Assessflow",
        "/student/waiting": "Waiting for Exam | Assessflow",
        "/student/success": "Exam Completed | Assessflow",
        "/student/exam": "Live Exam | Assessflow",
        "/student/disqualified": "Disqualified | Assessflow",
        "/about": "About Us | Assessflow",
        "/privacy": "Privacy Policy | Assessflow",
        "/terms": "Terms & Conditions | Assessflow",
        "/licensing": "Licensing | Assessflow",
        "/contact": "Contact Us | Assessflow",
      };

      const title = pathTitleMap[location.pathname] || "Assessflow";
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
            <RouteBasedHeader />

            <main className="grow">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/company/login" element={<CompanyLogin />} />
                <Route path="/company/register" element={<CompanyRegister />} />

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

                {/* Company Dashboard */}
                <Route
                  path="/company"
                  element={
                    <RequireAuth allowedTypes={["company"]}>
                      <CompanyDashboard />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/company-dashboard"
                  element={
                    <RequireAuth allowedTypes={["company"]}>
                      <CompanyDashboard />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/company-create-drive"
                  element={
                    <RequireAuth allowedTypes={["company"]}>
                      <CompanyCreateDrive />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/company-drive-detail"
                  element={
                    <RequireAuth allowedTypes={["company"]}>
                      <CompanyDriveDetail />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/company-send-emails"
                  element={
                    <RequireAuth allowedTypes={["company"]}>
                      <CompanySendEmails />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/company-tickets"
                  element={
                    <RequireAuth allowedTypes={["company"]}>
                      <CompanySupportTickets />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/company-raise-ticket"
                  element={
                    <RequireAuth allowedTypes={["company"]}>
                      <CompanyRaiseTicket />
                    </RequireAuth>
                  }
                />

                {/* Static Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/licensing" element={<Licensing />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>

            <RouteBasedFooter />
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
