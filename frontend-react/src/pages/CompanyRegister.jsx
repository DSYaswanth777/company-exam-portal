import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import companyService from "../services/companyService";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  User,
  Link as LinkIcon,
} from "lucide-react";
import { getErrorMessage } from "../utils/errorHelpers";

export default function CompanyRegister() {
  const [formData, setFormData] = useState({
    company_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    logo: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData((prev) => ({
        ...prev,
        logo: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("company_name", formData.company_name);
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      if (formData.logo) {
        payload.append("logo", formData.logo);
      }

      const res = await companyService.register(payload);
      const data = res.data;
      toast.success(
        data.message || "Registered successfully. Waiting for admin approval.",
      );
      setTimeout(() => navigate("/company/login"), 1200);
    } catch (err) {
      console.error("Register error", err?.response || err);
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-['Poppins']">
      <div className="w-full max-w-[540px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in zoom-in duration-500 my-8">
        {/* Header Section with Logo */}
        <Link
          to="/"
          className="bg-[#EBF2FF] py-8 flex flex-col items-center justify-center hover:bg-[#dfe9ff] transition-colors duration-300 w-full"
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
            <h1 className="text-3xl font-semibold text-[#1e293b] tracking-tight mb-2">
              Company Registration
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Create your account to start managing recruitment drives
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-widest mb-2.5 ml-1">
                  Company Name
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    type="text"
                    className="w-full h-[60px] pl-12 pr-6 bg-white border border-slate-100 rounded-xl text-base font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                    placeholder="Acme Corp"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-widest mb-2.5 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    type="text"
                    className="w-full h-[60px] pl-12 pr-6 bg-white border border-slate-100 rounded-xl text-base font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                    placeholder="acme_corp"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-widest mb-2.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full h-[60px] pl-12 pr-6 bg-white border border-slate-100 rounded-xl text-base font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  placeholder="admin@acme.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-widest mb-2.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    className="w-full h-[60px] pl-12 pr-14 bg-white border border-slate-100 rounded-xl text-base font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-widest mb-2.5 ml-1">
                  Confirm
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full h-[60px] pl-12 pr-14 bg-white border border-slate-100 rounded-xl text-base font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-widest mb-2.5 ml-1">
                Company Logo
              </label>
              <div className="relative group">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  name="logo"
                  onChange={handleChange}
                  type="file"
                  accept="image/*"
                  className="w-full h-[60px] pl-12 pr-6 pt-4 bg-white border border-slate-100 rounded-xl text-base font-bold text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-slate-400 ml-1">
                PNG or JPEG, max 2 MB
              </p>
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
              <span className="text-lg uppercase tracking-widest">
                {loading ? "Registering..." : "Register"}
              </span>
              {!loading && (
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between px-2">
            <Link
              to="/company/login"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors tracking-tight"
            >
              Already have an account?
            </Link>
            <Link
              to="/"
              className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors tracking-tight"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
