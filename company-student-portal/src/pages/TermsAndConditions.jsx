import React from "react";
import StaticPageLayout from "../components/StaticPageLayout";

const TermsAndConditions = () => {
  return (
    <StaticPageLayout title="Terms and Conditions">
      <p className="mb-4">Last Updated: March 3, 2026</p>
      <p className="mb-4">
        By accessing or using Assessflow, you agree to be bound by these Terms
        and Conditions.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Use of the Platform
      </h2>
      <p className="mb-4">
        You agree to use the platform only for lawful purposes and in accordance
        with these Terms. You are responsible for maintaining the
        confidentiality of your account credentials.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Intellectual Property
      </h2>
      <p className="mb-4">
        The platform and its original content, features, and functionality are
        owned by Assessflow and are protected by international copyright,
        trademark, and other intellectual property laws.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Limitation of Liability
      </h2>
      <p className="mb-4">
        In no event shall Assessflow be liable for any indirect, incidental,
        special, consequential, or punitive damages arising out of your use of
        the platform.
      </p>
      <h2
        className="text-2xl font-semibold mt-8 mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Governing Law
      </h2>
      <p className="mb-4">
        These Terms shall be governed by and construed in accordance with the
        laws of the jurisdiction in which Assessflow operates.
      </p>
    </StaticPageLayout>
  );
};

export default TermsAndConditions;
