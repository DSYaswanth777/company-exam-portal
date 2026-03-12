import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react"; // Using Lucide for social icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] text-slate-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12">
          {/* Logo and Description */}
          <div className="mb-8 lg:mb-0 max-w-sm">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img
                src="/icons/footerLogo.png"
                alt="Assessflow Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-white text-2xl font-bold tracking-tight">
                Assessflow
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The modern platform to create, manage, and scale your recruitment
              drives efficiently and securely.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-[600] text-white mt-4 lg:mt-16">
            <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
            <Link to="/features" className="hover:text-blue-500 transition-colors">Product Features</Link>
            <Link to="/how-it-works" className="hover:text-blue-500 transition-colors">How it works</Link>
            <Link to="/pricing" className="hover:text-blue-500 transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-blue-500 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link>
          </nav>
        </div>

        {/* Divider */}
        <hr className="border-slate-800 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-slate-500">
            © {currentYear} AssessFlow. All rights reserved.
          </span>
          
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;