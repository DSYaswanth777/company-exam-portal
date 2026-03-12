import registerCompany from "/icons/registerCompany.png"
import inviteStudents from "/icons/inviteStudents.png"
import reviewResults from "/icons/reviewResults.png"
import createHiringDrive from "/icons/createHiringDrive.png"

export default function Features() {
  const items = [
    {
      id: 1,
      icon: registerCompany,
      title: "Register Company",
      desc: "Sign up and submit company details for approval to start recruiting.",
    },
    {
      id: 2,
      icon: createHiringDrive,
      title: "Create Hiring Drive",
      desc: "Set up recruitment drives with custom exam questions and timelines.",
    },
    {
      id: 3,
      icon: inviteStudents,
      title: "Invite Students",
      desc: "Send invitations to students from partner colleges effortlessly.",
    },
    {
      id: 4,
      icon: reviewResults,
      title: "Review Results",
      desc: "Analyze performance using detailed analytics and shortlisting tools.",
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 bg-light">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[40px] font-[600] mb-3">
            How Assessflow Works
          </h2>
          <p className="text-[18px] text-slate-500">
          Get your hiring drive up and running in just a few steps.          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative overflow-hidden bg-white rounded-xl p-7 border border-slate-400/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="relative z-10">
                <div className="mb-6 w-14 h-14 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={it.icon} 
                    alt={it.title} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-[18px] font-[600] mb-3">
                  {it.id}. {it.title}
                </h3>
                <p className="text-[15px] text-slate-600">
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