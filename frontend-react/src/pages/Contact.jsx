import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className=" min-h-screen  py-20 px-4 flex flex-col items-center">
      <span className="px-4 py-1 bg-slate-100 border border-slate-700 rounded-full text-xs text-blue-800 mb-6">Support & Sales</span>
      <h1 className="text-5xl font-[600] mb-6">Contact Us</h1>
      <p className="text-slate-400 max-w-xl text-center mb-16">
        Have questions or need support? Our team is here to help with onboarding, hiring drives, and product guidance.
      </p>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Info Cards */}
        <div className="space-y-6">
          <div className="bg-white text-slate-900 p-6 rounded-3xl flex items-center gap-4 shadow border border-slate-200">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Mail /></div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-[600]">support@assessflow.com</p>
            </div>
          </div>
          <div className="bg-white text-slate-900 p-6 rounded-3xl flex items-center gap-4 shadow border border-slate-200">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Phone /></div>
            <div>
              <p className="text-sm text-slate-500">Phone</p>
              <p className="font-[600]">+91 XXXXX XXXXX</p>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200">
          <h3 className="text-2xl font-[600] mb-2">Send us a message</h3>
          <p className="text-slate-500 text-sm mb-8">We usually respond within one business day.</p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-[600] mb-1 block">Name*</label>
                <input type="text" placeholder="Your full name" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-[600] mb-1 block">Email*</label>
                <input type="email" placeholder="you@company.com" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-[600] mb-1 block">Company Name*</label>
              <input type="text" placeholder="AssessFlow Client Pvt Ltd" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-[600] mb-1 block">Message</label>
              <textarea rows="4" placeholder="Tell us about your requirements..." className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>
            <button className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white font-[600] rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}