
import createDrives from "/icons/createDrives.png";
import smartApprovals from "/icons/smartApprovals.png";
import analyticsDashboard from "/icons/analyticsDashboard.png";
import secureExam from "/icons/secureExam.png";
import collegeNetwork from "/icons/collegeNetwork.png";
import support from "/icons/support.png";

export default function Features() {
  const items = [
    {
      id: 1,
      icon: createDrives,
      title: "Create Drives",
      desc: "Quickly create hiring drives with scoped targets and custom question sets.",
    },
    {
      id: 2,
      icon: smartApprovals,
      title: "Smart Approvals",
      desc: "Admins review and approve company registrations with intelligent workflows.",
    },
    {
      id: 3,
      icon: analyticsDashboard,
      title: "Analytics Dashboard",
      desc: "Track participation, scores and get actionable insights in real-time.",
    },
    {
      id: 4,
      icon: secureExam,
      title: "Secure Exam System",
      desc: "Bank-level encryption and token-based authentication for all users.",
    },
    {
      id: 5,
      icon: collegeNetwork,
      title: "College Network",
      desc: "Connect with hundreds of colleges and manage student groups easily.",
    },
    {
      id: 6,
      icon: support,
      title: "24/7 Support",
      desc: "Round-the-clock support team ready to help with any questions.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 ">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-[600] mb-4">
            Our Powerful Features
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to run recruitment assessments end-to-end.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative overflow-hidden rounded-2xl bg-slate-900 to-slate-900/50 p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={it.icon}
                    alt={it.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-[20px] font-[600] text-white mb-3">
                  {it.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {it.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}