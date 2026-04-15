import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Key, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [access_token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { studentLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await studentLogin(email, access_token);

      if (result.success) {
        toast.success("Login successful!");
        if (result.data.exam_submitted_at) {
          navigate("/result");
        } else {
          navigate("/instructions");
        }
      } else {
        toast.error(result.error || "Invalid email or access access_token");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[500px] bg-white rounded-b-xl shadow-xl overflow-hidden border border-gray-100/50">
        {/* Header with Background/Logo Area */}
        <div className="bg-[#EBF2FF] rounded-xl py-10 flex flex-col items-center justify-center transition-colors duration-300 w-full">
          <div className="flex items-center gap-3">
            <img
              src="/assessFlowLogo.png"
              alt="Assessflow Logo"
              className="h-14 object-contain"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-medium text-gray-900 mb-3">
              Student Login
            </h2>
            <p className="text-gray-500 text-sm">
              Enter your credentials to access the assessment
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-md font-medium text-gray-500 mb-2">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Please enter your registered email"
                />
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-500 mb-2">
                Exam Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={access_token}
                  onChange={(e) => setToken(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="XXXX-XXXX-XXXX"
                />
              </div>
              <p className="mt-2 text-sm text-gray-400 ">
                Token provided in your invitation email
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]  text-white font-bold py-4 px-6 rounded-xl transition-all  shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Entering..." : "Enter Exam"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
