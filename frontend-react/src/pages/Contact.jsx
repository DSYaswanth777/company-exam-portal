import React from "react";
import StaticPageLayout from "../components/StaticPageLayout";

const Contact = () => {
  return (
    <StaticPageLayout title="Contact Us">
      <p className="mb-4">
        We're here to help! If you have any questions, feedback, or need
        support, please don't hesitate to reach out to us.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Support
          </h2>
          <p className="mb-2">Email: support@assessflow.com</p>
          <p>Available 24/7 for technical assistance.</p>
        </div>
        <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Sales
          </h2>
          <p className="mb-2">Email: sales@assessflow.com</p>
          <p>Contact us for custom licensing and enterprise queries.</p>
        </div>
      </div>
      <h2
        className="text-2xl font-semibold mt-12 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Headquarters
      </h2>
      <p className="mb-4">
        Assessflow Inc.
        <br />
        123 Innovation Drive, Suite 100
        <br />
        Tech Valley, CA 94000
        <br />
        United States
      </p>
    </StaticPageLayout>
  );
};

export default Contact;
