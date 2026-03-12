import React from "react";
import {
  ShieldCheck,
  LayoutGrid,
  BarChart3,
  Mail,
  Timer,
  UserX,
} from "lucide-react";

export default function About() {
  const capabilities = [
    {
      icon: <ShieldCheck className="text-blue-600" />,
      title: "Secure Online Exams",
      desc: "Protected assessments with reliable identity and access controls.",
    },
    {
      icon: <LayoutGrid className="text-blue-600" />,
      title: "Recruitment Drive Management",
      desc: "Launch and manage multi-step hiring drives without scattered tools.",
    },
    {
      icon: <BarChart3 className="text-blue-600" />,
      title: "Candidate Analytics",
      desc: "Use structured analytics to review outcomes and shortlist faster.",
    },
    {
      icon: <Mail className="text-blue-600" />,
      title: "Token-Based Secure Access",
      desc: "Generate unique tokens and send branded invite emails.",
    },
    {
      icon: <Timer className="text-blue-600" />,
      title: "Real-Time Results",
      desc: "Track results instantly and move candidates through the funnel sooner.",
    },
    {
      icon: <UserX className="text-blue-600" />,
      title: "Disqualification System",
      desc: "Detect flag suspicious activity automatically.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-16 text-center">
        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
          Company Story
        </span>
        <h1 className="text-5xl font-bold mt-6 mb-4">
          About <span className="text-blue-600">AssessFlow</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg mb-16">
          AssessFlow is a modern recruitment assessment platform designed to
          help companies conduct secure online exams, manage hiring drives, and
          evaluate candidates efficiently.
        </p>

        {/* Our Mission Card */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12 mb-24">
          <div className="flex-1 text-left">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-slate-500 leading-relaxed">
              Our mission is to simplify recruitment through secure,
              intelligent, and scalable exam systems. We help teams launch
              hiring drives faster, reduce manual coordination, and evaluate
              candidates with greater confidence using reliable digital
              workflows.
            </p>
          </div>
          <div className="flex-1">
            <img
              src="/graduation-image.png"
              alt="Mission"
              className="rounded-2xl w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Key Capabilities Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-2">Key Capabilities</h2>
          <p className="text-slate-500 mb-12">
            Built to support secure exams and dependable evaluation across large
            pipelines.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 text-left shadow-sm"
              >
                <div className="p-2 bg-blue-50 rounded-lg">{cap.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{cap.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
