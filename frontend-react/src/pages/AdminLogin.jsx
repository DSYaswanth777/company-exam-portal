import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import adminService from "../services/adminService";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { getErrorMessage } from "../utils/errorHelpers";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminService.login(username, password);
      const data = res.data;
      if (data.access_token) {
        login(data.access_token, "admin");
        toast.success("Login successful");
        navigate("/admin");
      } else {
        throw new Error("No access token returned");
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-['Poppins']">
      <div className="w-full max-w-[494px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in zoom-in duration-500">
        {/* Header Section with Logo */}
        <Link
          to="/"
          className="bg-[#EBF2FF] py-8 flex rounded-xl flex-col items-center justify-center hover:bg-[#dfe9ff] transition-colors duration-300 w-full"
        >
          <img
            src="/assessFlowLogo.png"
            alt="Assessflow Logo"
            className="h-14 object-contain mb-2"
          />
        </Link>

        {/* Content Section */}
        <div className="px-10 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font- font-semibold font-semibold text-[#1e293b] tracking-tight mb-2">
              Admin Login
            </h1>
            <p className="text-slate-500  text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-md  text-gray-500">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2  -translate-y-1/3 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="w-full mt-2 h-[50px] pl-12 pr-6 bg-white border border-slate-400 rounded-xl text-base  text-gray-600 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500  transition-all"
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-md  mb-2 text-gray-500">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="w-full h-[50px] font-light pl-12 pr-14 bg-white border border-slate-400 rounded-xl text-base  text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[64px] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3 group px-4"
            >
              <span className="text-lg  font-medium tracking-widest">
                {loading ? "Signing in..." : "Login"}
              </span>
              {!loading && (
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/admin/forgot-password"
              className="text-md  text-blue-600 hover:text-blue-700 transition-colors tracking-tight"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
