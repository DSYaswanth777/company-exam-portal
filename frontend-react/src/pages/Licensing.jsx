import React from "react";
import StaticPageLayout from "../components/StaticPageLayout";

const Licensing = () => {
  return (
    <StaticPageLayout title="Licensing">
      <p className="mb-4">
        Assessflow offers various licensing options for companies of all sizes.
        Our licenses are designed to provide maximum value and flexibility.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Enterprise Licensing
      </h2>
      <p className="mb-4">
        For large organizations with complex recruitment needs, our Enterprise
        license provides unlimited exams, priority support, and custom
        integrations.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Standard Licensing
      </h2>
      <p className="mb-4">
        Ideal for medium-sized businesses, the Standard license includes all
        core features with a generous cap on the number of candidates and exams.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Small Business Licensing
      </h2>
      <p className="mb-4">
        Designed for startups and small teams, this license offers an affordable
        way to access professional-grade recruitment tools.
      </p>
      <p className="mt-8 italic">
        For specific licensing inquiries, please contact our sales team through
        the Contact page.
      </p>
    </StaticPageLayout>
  );
};

export default Licensing;
