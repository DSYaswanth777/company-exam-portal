import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap- items-center">
          <div>
            <h1
              className="text-[68px] font-[700] tracking-tight mb-6 leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Streamline Your{" "}
              <span className="bg-linear-to-r from-blue-400 via-blue-600  to-blue-400  bg-clip-text text-transparent">
                Hiring Process
              </span>
            </h1>

            <p
              className="text-[18px] mb-8 leading-relaxed max-w-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Create, manage and run hiring drives - connect with top colleges
              and students seamlessly. Built for companies and admins to
              coordinate exams, approvals and reports with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <NavLink
                to="/company/login"
                className="inline-flex text-[16px] items-center justify-center px-6 py-3 border-2 border-slate-200 hover:border-blue-400 hover:text-white  rounded-xl hover:bg-slate-800 transition-all duration-300"
              >
                Login
              </NavLink>
              <NavLink
                to="/company/register"
                className="inline-flex text-[16px] items-center justify-center px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white  rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                </span>
              </NavLink>
            </div>

            <div
              className="flex flex-wrap gap-6 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-800 text-xs">
                  ✓
                </span>
                Trusted by 500 Companies
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-800 text-xs">
                  ✓
                </span>
                Enterprise-Grade Security
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-800 text-xs">
                  ✓
                </span>
                24/7 support
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <img src="dashboard.png" alt="dashboard" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
