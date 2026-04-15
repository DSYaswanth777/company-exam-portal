import React from "react";

const StaticPageLayout = ({ title, children }) => {
  return (
    <div
      className="min-h-screen pt-20"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Background decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-border-color shadow-xl"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h1 className="text-4xl font-extrabold mb-8 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-text-secondary"
            style={{ color: "var(--text-secondary)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticPageLayout;
