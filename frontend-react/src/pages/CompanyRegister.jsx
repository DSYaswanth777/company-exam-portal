import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import companyService from "../services/companyService";
import { getErrorMessage } from "../utils/errorHelpers";
import {
  Mail,
  Lock,
  ArrowRight,
  Building2,
  AtSign,
  ChevronDown,
  Key,
  Upload,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const InputWrapper = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-[600] text-slate-500 uppercase tracking-[0.1em] ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      {children}
    </div>
  </div>
);

export default function CompanyRegister() {
  const [formData, setFormData] = useState({
    company_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    logo: null, // Changed from logo_url to logo file
    plan: "Premium(Drives-20)",
    agree: false,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "logo") {
      const file = files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error("File size must be less than 2MB");
          return;
        }
        setFormData((prev) => ({ ...prev, logo: file }));
        setLogoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const removeLogo = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, logo: null }));
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        data.message || "Registered successfully. Waiting for admin approval."
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
    <>
    <Navbar/>
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-[580px] bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 md:p-14 animate-in fade-in zoom-in duration-500">
          <div className="mb-10">
            <h1 className="text-3xl font-[600] text-slate-900 mb-2">
              Register Company
            </h1>
            <p className="text-slate-500 text-[15px] font-[300] leading-relaxed">
              Create your ExamPortal account to start managing hiring drives and
              tracking performance.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <InputWrapper label="Company Name" icon={Building2}>
              <input
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                type="text"
                className="w-full h-[56px] pl-12 pr-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter registered company name"
                required
              />
            </InputWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Company Username" icon={AtSign}>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  className="w-full h-[56px] pl-12 pr-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:bg-white outline-none transition-all"
                  placeholder="company_handle"
                  required
                />
              </InputWrapper>

              <InputWrapper label="Email Address" icon={Mail}>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full h-[56px] pl-12 pr-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:bg-white outline-none transition-all"
                  placeholder="admin@company.com"
                  required
                />
              </InputWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Password" icon={Lock}>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  className="w-full h-[56px] pl-12 pr-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </InputWrapper>

              <InputWrapper label="Confirm Password" icon={Key}>
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  className="w-full h-[56px] pl-12 pr-4 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-700 placeholder:text-slate-400 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </InputWrapper>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-[600] text-slate-500 uppercase tracking-wider ml-1">
                Drives Plan
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-blue-50 rounded flex items-center justify-center">
                  <Lock className="h-3 w-3 text-blue-500" />
                </div>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full h-[56px] pl-12 pr-10 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-700 appearance-none outline-none focus:bg-white"
                >
                  <option>Basic(Drives-5)</option>
                  <option>Pro(Drives-10)</option>
                  <option>Premium(Drives-20)</option>
                  <option>Custom(Unlimited)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* New Logo Upload UI */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-[600] text-slate-500 uppercase tracking-wider ml-1">
                Company Logo
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                className="relative w-full h-[120px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all overflow-hidden"
              >
                <input
                  type="file"
                  name="logo"
                  ref={fileInputRef}
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                />

                {!logoPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Upload Logo (Max 2MB)
                    </span>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm disabled:opacity-80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group mt-4">
              <div className="relative">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="peer hidden"
                />
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                </div>
              </div>
              <span className="text-[14px] text-slate-500">
                I agree to the company's{" "}
                <span className="font-semibold text-slate-700">
                  Terms and Conditions
                </span>{" "}
                and{" "}
                <span className="font-semibold text-slate-700">
                  Privacy Policy
                </span>
                .
              </span>
            </label>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                <p className="text-[14px] font-[500] text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[60px] bg-slate-50 hover:bg-slate-100 disabled:opacity-80 text-slate-400 font-[600] rounded-2xl transition-all flex items-center justify-center gap-3 mt-4"
            >
              <span className="text-[16px]">
                {loading ? "Registering..." : "Register Company"}
              </span>
              {!loading && <ArrowRight className="h-5 w-5 opacity-40" />}
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
}
