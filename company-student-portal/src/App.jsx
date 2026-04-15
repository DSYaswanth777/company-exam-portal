import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import WaitingRoom from "./pages/WaitingRoom";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import DisqualifiedPage from "./pages/DisqualifiedPage";
import InstructionsPage from "./pages/InstructionsPage";
import ErrorBoundary from "./components/ErrorBoundary";

// Migrated Company Pages
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyCreateDrive from "./pages/CompanyCreateDrive";
import CompanyDriveDetail from "./pages/CompanyDriveDetail";
import CompanySendEmails from "./pages/CompanySendEmails";
import CompanySupportTickets from "./pages/CompanySupportTickets";
import CompanyRaiseTicket from "./pages/CompanyRaiseTicket";
import CompanyNotifications from "./pages/CompanyNotifications";

// Migrated Static Pages
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Licensing from "./pages/Licensing";
import Contact from "./pages/Contact";

// Migrated Components
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";

function RouteBasedHeader() {
  const location = useLocation();
  const noHeaderPaths = [
    "/admin",
    "/company",
    "/company/login",
    "/company/register",
    "/login", // Student login
    "/exam",
    "/waiting-room",
    "/instructions"
  ];
  if (noHeaderPaths.some((path) => location.pathname.startsWith(path))) {
    return null;
  }
  return <Navbar />;
}

function RouteBasedFooter() {
  const location = useLocation();
  const noFooterPaths = [
    "/admin",
    "/company",
    "/company/login",
    "/company/register",
    "/login",
    "/exam",
    "/waiting-room",
    "/instructions"
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
      "/login": "Student Login | Assessflow",
      "/instructions": "Exam Instructions | Assessflow",
      "/waiting-room": "Waiting for Exam | Assessflow",
      "/result": "Exam Completed | Assessflow",
      "/exam": "Live Exam | Assessflow",
      "/disqualified": "Disqualified | Assessflow",
      "/company/login": "Login | Assessflow",
      "/company/register": "Company Registration | Assessflow",
      "/company": "Company Dashboard | Assessflow",
      "/company-dashboard": "Company Dashboard | Assessflow",
      "/company-create-drive": "Create New Drive | Assessflow",
      "/company-drive-detail": "Drive Details | Assessflow",
      "/company-send-emails": "Send Invitations | Assessflow",
      "/company-tickets": "Support Tickets | Assessflow",
      "/company-raise-ticket": "Raise Ticket | Assessflow",
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

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <TitleHandler />
          <div className="relative z-0 bg-white min-h-screen flex flex-col font-poppins">
            <RouteBasedHeader />
            <main className="grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/licensing" element={<Licensing />} />
                <Route path="/contact" element={<Contact />} />

                {/* Student Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route 
                   path="/waiting-room" 
                   element={
                    <RequireAuth allowedTypes={["student"]}>
                      <WaitingRoom />
                    </RequireAuth>
                   } 
                />
                <Route 
                   path="/instructions" 
                   element={
                    <RequireAuth allowedTypes={["student"]}>
                      <InstructionsPage />
                    </RequireAuth>
                   } 
                />
                <Route 
                   path="/exam" 
                   element={
                    <RequireAuth allowedTypes={["student"]}>
                      <ExamPage />
                    </RequireAuth>
                   } 
                />
                <Route 
                   path="/result" 
                   element={
                    <RequireAuth allowedTypes={["student"]}>
                      <ResultPage />
                    </RequireAuth>
                   } 
                />
                <Route 
                   path="/disqualified" 
                   element={
                    <RequireAuth allowedTypes={["student"]}>
                      <DisqualifiedPage />
                    </RequireAuth>
                   } 
                />

                {/* Company Routes */}
                <Route path="/company/login" element={<CompanyLogin />} />
                <Route path="/company/register" element={<CompanyRegister />} />

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

                <Route
                  path="/company-notifications"
                  element={
                    <RequireAuth allowedTypes={["company"]}>
                      <CompanyNotifications />
                    </RequireAuth>
                  }
                />

                {/* Redirects */}
                <Route path="/student" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
            <RouteBasedFooter />
            <Toaster position="top-right" reverseOrder={false} />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
