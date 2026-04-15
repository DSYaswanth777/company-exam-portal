import React from "react";
import {
  Check,
  CreditCard,
  Smartphone,
  Landmark,
  Briefcase,
} from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "99",
      features: [
        "Up to 5 drives /month",
        "Basic Exam Management",
        "Basic Results Dashboard",
        "Email Support",
      ],
      buttonText: "Get Started",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "199",
      features: [
        "Up to 20 drives /month",
        "Custom Exam Configurations",
        "Bulk Student Invitations",
        "Dedicated Account Support",
      ],
      buttonText: "Start Free Trial",
      highlighted: true,
      badge: "MOST POPULAR",
    },
    {
      name: "Pro",
      price: "149",
      features: [
        "Up to 10 drives /month",
        "Advanced Exam Scheduling",
        "Candidate Result Reports",
        "Priority Email Support",
      ],
      buttonText: "Get Started",
      highlighted: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      subtext: "Tailored to your needs",
      features: [
        "Unlimited Drives",
        "Unlimited Students",
        "Advanced Proctoring Options",
        "24/7 Premium Support",
      ],
      buttonText: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section className=" py-20 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className=" text-4xl font-[600] mb-4">Simple Pricing</h2>
          <p className="text-gray-400">
            Transparent plans that scale with your hiring needs.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-white text-gray-900 border-1 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 z-10"
                  : "bg-white text-gray-900 border-1 border-slate-300  shadow-xl"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-4 py-1 rounded-full tracking-widest">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-xl font-bold mb-4">{plan.name}</h3>

              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">
                  {plan.price === "Custom" ? "" : "$"}
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-gray-500 ml-2">/mo</span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-8">
                {plan.subtext || "Billed Monthly"}
              </p>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-sm text-gray-600 font-medium"
                  >
                    <Check
                      className="w-4 h-4 text-blue-500 mr-3"
                      strokeWidth={3}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 text-[15px] rounded-xl transition-all ${
                  plan.highlighted
                    ? "bg-blue-500  text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30"
                    : "border border-slate-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Payment Methods */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <CreditCard size={18} />
            <span>Credit / Debit Cards</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone size={18} />
            <span>UPI</span>
          </div>
          <div className="flex items-center gap-2">
            <Landmark size={18} />
            <span>Net Banking</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={18} />
            <span>Corporate Billing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
