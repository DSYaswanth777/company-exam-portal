import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { DEV_AUTH_BYPASS } from "./utils/api";
import LoginPage from "./pages/LoginPage";
import WaitingRoom from "./pages/WaitingRoom";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import DisqualifiedPage from "./pages/DisqualifiedPage";
import InstructionsPage from "./pages/InstructionsPage";
import ErrorBoundary from "./components/ErrorBoundary";
// import "./App.css"; // Removing redundant tailwind import

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="relative z-0 bg-white min-h-screen flex flex-col font-poppins">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/waiting-room" element={<WaitingRoom />} />
              <Route path="/instructions" element={<InstructionsPage />} />
              <Route path="/exam" element={<ExamPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/disqualified" element={<DisqualifiedPage />} />
              <Route
                path="/"
                element={<Navigate to="/login" replace />}
              />
            </Routes>
            <Toaster position="top-right" reverseOrder={false} />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
