import React from "react";
import StaticPageLayout from "../components/StaticPageLayout";

const About = () => {
  return (
    <StaticPageLayout title="About Assessflow">
      <p className="mb-4">
        Assessflow is a premium, intelligent exam portal designed to streamline
        the recruitment process for modern companies. Our platform provides a
        seamless experience for both recruiters and candidates, ensuring that
        the best talent is identified through rigorous and fair testing.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Our Mission
      </h2>
      <p className="mb-4">
        To empower organizations with data-driven insights during their hiring
        process, making recruitment more efficient, transparent, and effective.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Why Choose Us?
      </h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Intelligent exam creation and management.</li>
        <li>Real-time monitoring and advanced anti-cheating measures.</li>
        <li>Automated grading and comprehensive performance analytics.</li>
        <li>Seamless integration with existing recruitment workflows.</li>
      </ul>
    </StaticPageLayout>
  );
};

export default About;
